export interface TripConflict {
    id: string;
    type: 'Height' | 'Scheduling' | 'Preference' | 'Sensory';
    title: string;
    detail: string;
    severity: 'Low' | 'Medium' | 'High';
}

export interface GroupPreference {
    userId: string;
    userName: string;
    mustDos: string[];
    noGos: string[];
    stamina: number; // 1-10
}

class PreTripManager {
    /**
     * Generates a "Magic Link" token for mobile sync.
     * In production, this would be a secure JWT or signed hash.
     */
    generateMagicToken(userId: string, tripId: string): string {
        const timestamp = Date.now();
        const payload = `${userId}|${tripId}|${timestamp}`;
        // Mocking an encoded token
        return btoa(payload).replace(/=/g, '');
    }

    /**
     * Aggregates group preferences to detect conflict points.
     */
    detectConflicts(members: GroupPreference[]): TripConflict[] {
        const newConflicts: TripConflict[] = [];

        // Logic: Look for overlapping Must-Dos and No-Gos
        const allMustDos = new Set(members.flatMap(m => m.mustDos));
        const allNoGos = new Set(members.flatMap(m => m.noGos));

        allMustDos.forEach(ride => {
            if (allNoGos.has(ride)) {
                newConflicts.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'Preference',
                    title: ride,
                    detail: 'Significant clash: Some members marked this as "No-Go" while others marked as "Must-Do".',
                    severity: 'High'
                });
            }
        });

        return newConflicts;
    }
}

export const preTripManager = new PreTripManager();
export default preTripManager;
