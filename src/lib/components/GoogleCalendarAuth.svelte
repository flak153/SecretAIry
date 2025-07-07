<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/Icon.svelte';
	import { calendarStore } from '$lib/stores/calendar.svelte';
	
	interface Props {
		onEventsLoaded?: (events: any[]) => void;
	}
	
	let { onEventsLoaded }: Props = $props();
	
	import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_GOOGLE_API_KEY } from '$env/static/public';
	
	// Google Calendar API configuration
	const CLIENT_ID = PUBLIC_GOOGLE_CLIENT_ID;
	const API_KEY = PUBLIC_GOOGLE_API_KEY;
	const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
	const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
	
	let isSignedIn = $state(false);
	let isLoading = $state(false);
	let userEmail = $state('');
	let events = $state<any[]>([]);
	let error = $state('');
	let tokenClient: any;
	let gapiInited = $state(false);
	let gisInited = $state(false);
	
	onMount(() => {
		// Load the Google API client library
		const gapiScript = document.createElement('script');
		gapiScript.src = 'https://apis.google.com/js/api.js';
		gapiScript.onload = () => {
			gapiLoaded();
		};
		document.body.appendChild(gapiScript);
		
		// Load the Google Identity Services library
		const gisScript = document.createElement('script');
		gisScript.src = 'https://accounts.google.com/gsi/client';
		gisScript.onload = () => {
			gisLoaded();
		};
		document.body.appendChild(gisScript);
		
		return () => {
			// Cleanup
			if (gapiScript.parentNode) {
				gapiScript.parentNode.removeChild(gapiScript);
			}
			if (gisScript.parentNode) {
				gisScript.parentNode.removeChild(gisScript);
			}
		};
	});
	
	function gapiLoaded() {
		// @ts-ignore
		gapi.load('client', initializeGapiClient);
	}
	
	async function initializeGapiClient() {
		// @ts-ignore
		await gapi.client.init({
			apiKey: API_KEY,
			discoveryDocs: [DISCOVERY_DOC],
		});
		gapiInited = true;
		maybeEnableButtons();
	}
	
	function gisLoaded() {
		// @ts-ignore
		tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: CLIENT_ID,
			scope: SCOPES,
			callback: '', // defined later
		});
		gisInited = true;
		maybeEnableButtons();
	}
	
	function maybeEnableButtons() {
		if (gapiInited && gisInited) {
			// Check if we have a saved token
			const savedToken = localStorage.getItem('google-calendar-token');
			if (savedToken) {
				// @ts-ignore
				gapi.client.setToken({ access_token: savedToken });
				checkTokenValidity();
			}
		}
	}
	
	async function checkTokenValidity() {
		try {
			// Try to make a simple API call to check if token is valid
			// @ts-ignore
			const response = await gapi.client.calendar.calendarList.list();
			if (response.result) {
				isSignedIn = true;
				// Get user info from the first calendar (usually primary)
				const primaryCalendar = response.result.items?.find((cal: any) => cal.primary);
				if (primaryCalendar) {
					userEmail = primaryCalendar.id || '';
				}
				loadCalendarEvents();
			}
		} catch (err) {
			// Token is invalid, clear it
			localStorage.removeItem('google-calendar-token');
			isSignedIn = false;
		}
	}
	
	function handleAuthClick() {
		tokenClient.callback = async (resp: any) => {
			if (resp.error !== undefined) {
				throw (resp);
			}
			
			// Save token to localStorage
			localStorage.setItem('google-calendar-token', resp.access_token);
			isSignedIn = true;
			
			// Get user calendar info
			try {
				// @ts-ignore
				const response = await gapi.client.calendar.calendarList.list();
				const primaryCalendar = response.result.items?.find((cal: any) => cal.primary);
				if (primaryCalendar) {
					userEmail = primaryCalendar.id || '';
				}
			} catch (err) {
				console.error('Error getting calendar list:', err);
			}
			
			await loadCalendarEvents();
		};
		
		// @ts-ignore
		if (gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent
			tokenClient.requestAccessToken({ prompt: 'consent' });
		} else {
			// Skip display of account chooser and consent dialog
			tokenClient.requestAccessToken({ prompt: '' });
		}
	}
	
	function handleSignoutClick() {
		// @ts-ignore
		const token = gapi.client.getToken();
		if (token !== null) {
			// @ts-ignore
			google.accounts.oauth2.revoke(token.access_token);
			// @ts-ignore
			gapi.client.setToken('');
			localStorage.removeItem('google-calendar-token');
		}
		
		isSignedIn = false;
		userEmail = '';
		events = [];
		// Clear Google events from the store when signed out
		calendarStore.syncGoogleEvents([]);
	}
	
	async function loadCalendarEvents() {
		isLoading = true;
		error = '';
		
		try {
			// Get events from the primary calendar
			// @ts-ignore
			const response = await gapi.client.calendar.events.list({
				'calendarId': 'primary',
				'timeMin': (new Date()).toISOString(),
				'timeMax': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 100,
				'orderBy': 'startTime',
				'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // Use browser's timezone
			});
			
			const items = response.result.items || [];
			
			// Transform Google Calendar events to our format
			events = items.map((event: any) => ({
				id: event.id,
				title: event.summary || 'Untitled Event',
				description: event.description || '',
				startTime: event.start.dateTime || event.start.date,
				endTime: event.end.dateTime || event.end.date,
				allDay: !event.start.dateTime,
				location: event.location || '',
				attendees: event.attendees || [],
				source: 'google'
			}));
			
			// Sync events with the calendar store
			calendarStore.syncGoogleEvents(events);
			
			// Call the callback if provided
			if (onEventsLoaded) {
				onEventsLoaded(events);
			}
		} catch (err: any) {
			console.error('Error loading calendar events:', err);
			error = 'Failed to load calendar events. Please try again.';
		} finally {
			isLoading = false;
		}
	}
	
	// Sync events periodically
	$effect(() => {
		if (isSignedIn) {
			const interval = setInterval(loadCalendarEvents, 5 * 60 * 1000); // Refresh every 5 minutes
			return () => clearInterval(interval);
		}
	});
</script>

<div class="card preset-filled-surface-100-900 p-4">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold">Google Calendar</h3>
		{#if isSignedIn}
			<button 
				class="btn btn-sm preset-tonal-surface"
				onclick={handleSignoutClick}
			>
				Sign Out
			</button>
		{/if}
	</div>
	
	{#if error}
		<div class="alert alert-error mb-4">
			<Icon name="X" size={16} />
			<span class="text-sm">{error}</span>
		</div>
	{/if}
	
	{#if !isSignedIn}
		<div class="text-center py-8">
			<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
				<svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
				</svg>
			</div>
			<p class="text-surface-600 dark:text-surface-400 mb-4">
				Connect your Google Calendar to sync events
			</p>
			<button 
				class="btn preset-filled-primary-500"
				onclick={handleAuthClick}
				disabled={!gapiInited || !gisInited}
			>
				<svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
				</svg>
				Sign in with Google
			</button>
		</div>
	{:else}
		<div class="space-y-4">
			<div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
				<Icon name="user" size={16} />
				<span>Connected as {userEmail}</span>
			</div>
			
			{#if isLoading}
				<div class="flex items-center justify-center py-8">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
				</div>
			{:else if events.length > 0}
				<div>
					<p class="text-sm text-surface-600 dark:text-surface-400 mb-2">
						Synced {events.length} events
					</p>
					<button 
						class="btn btn-sm preset-tonal-primary"
						onclick={loadCalendarEvents}
					>
						<Icon name="chevronRight" size={16} class="mr-1 rotate-180" />
						Refresh
					</button>
				</div>
			{:else}
				<p class="text-sm text-surface-500 italic">No upcoming events found</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>