// Calendar events store
interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	startTime: string;
	endTime: string;
	allDay: boolean;
	location?: string;
	attendees?: any[];
	source: 'google' | 'manual' | 'outlook';
	calendar: 'work' | 'personal';
}

class CalendarStore {
	events = $state<CalendarEvent[]>([]);
	isLoading = $state(false);
	
	constructor() {
		// Load any stored events from localStorage
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('calendar-events');
			if (stored) {
				try {
					this.events = JSON.parse(stored);
				} catch (e) {
					console.error('Failed to load stored events:', e);
				}
			}
		}
	}
	
	// Add or update events from Google Calendar
	syncGoogleEvents(googleEvents: any[]) {
		// Remove existing Google events
		this.events = this.events.filter(e => e.source !== 'google');
		
		// Add new Google events
		const transformedEvents = googleEvents.map(event => ({
			...event,
			calendar: this.categorizeEvent(event)
		}));
		
		this.events = [...this.events, ...transformedEvents];
		this.saveToStorage();
	}
	
	// Categorize event as work or personal based on heuristics
	private categorizeEvent(event: any): 'work' | 'personal' {
		const title = event.title.toLowerCase();
		const description = (event.description || '').toLowerCase();
		
		// Work indicators
		const workKeywords = ['meeting', 'standup', 'review', 'sync', 'call', 'presentation', 
			'deadline', 'project', 'client', 'team', 'work', 'office'];
		
		// Check if any work keywords are present
		const isWork = workKeywords.some(keyword => 
			title.includes(keyword) || description.includes(keyword)
		);
		
		// Check if during work hours (9 AM - 6 PM on weekdays)
		const startDate = new Date(event.startTime);
		const hour = startDate.getHours();
		const dayOfWeek = startDate.getDay();
		const isDuringWorkHours = dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 18;
		
		return isWork || isDuringWorkHours ? 'work' : 'personal';
	}
	
	// Add manual event
	addEvent(event: Omit<CalendarEvent, 'id'>) {
		const newEvent = {
			...event,
			id: `manual-${Date.now()}`
		};
		this.events = [...this.events, newEvent];
		this.saveToStorage();
	}
	
	// Remove event
	removeEvent(id: string) {
		this.events = this.events.filter(e => e.id !== id);
		this.saveToStorage();
	}
	
	// Get events for a specific date
	getEventsForDate(date: Date) {
		const dateStr = date.toDateString();
		return this.events.filter(event => {
			const eventDate = new Date(event.startTime);
			return eventDate.toDateString() === dateStr;
		});
	}
	
	// Get events for date range
	getEventsForRange(startDate: Date, endDate: Date) {
		return this.events.filter(event => {
			const eventDate = new Date(event.startTime);
			return eventDate >= startDate && eventDate <= endDate;
		});
	}
	
	// Get events by calendar type
	getEventsByCalendar() {
		const work = this.events.filter(e => e.calendar === 'work');
		const personal = this.events.filter(e => e.calendar === 'personal');
		
		// Transform to match the existing format
		return {
			work: work.map(e => ({
				date: new Date(e.startTime),
				hours: this.calculateHours(e),
				title: e.title,
				startTime: e.startTime,
				endTime: e.endTime,
				allDay: e.allDay,
				location: e.location,
				description: e.description
			})),
			personal: personal.map(e => ({
				date: new Date(e.startTime),
				hours: this.calculateHours(e),
				title: e.title,
				startTime: e.startTime,
				endTime: e.endTime,
				allDay: e.allDay,
				location: e.location,
				description: e.description
			})),
			chores: [] // We can add a chores category later
		};
	}
	
	// Calculate event duration in hours
	private calculateHours(event: CalendarEvent): number {
		if (event.allDay) return 8; // Default for all-day events
		const start = new Date(event.startTime);
		const end = new Date(event.endTime);
		return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
	}
	
	// Save to localStorage
	private saveToStorage() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('calendar-events', JSON.stringify(this.events));
		}
	}
}

// Export singleton instance
export const calendarStore = new CalendarStore();