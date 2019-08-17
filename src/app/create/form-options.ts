// let options = [1, 2, 3];
function createDurationHours() {
    let hs = []
    for (let h = 0; h <= 12; h++) {
        hs.push({ display: h, value: h })
    }
    return hs;
}

export const options = {
    start_types: [
        { display: 'today', value: 'today' },
        { display: 'first available', value: 'first' },
        { display: 'set date', value: 'date' },
    ],
    end_types: [
        { display: 'times', value: 'times' },
        { display: 'days', value: 'day' },
        { display: 'weeks', value: 'week' },
        { display: 'months', value: 'month' },
        { display: 'set date', value: 'date' }
    ],
    duration_hours: createDurationHours(),
    duration_minutes: [
        { display: '0', value: 0 },
        { display: '15', value: 15 },
        { display: '30', value: 30 },
        { display: '45', value: 45 },
    ],
    frequency_units: [
        { display: 'daily', value: 'day' },
        { display: 'weekly', value: 'week' },
        { display: 'monthly', value: 'month' },
    ],
    groups: [
        { display: 'health', value: 'health' },
        { display: 'work', value: 'work' },
        { display: 'social', value: 'social' },
        { display: 'other', value: 'other' },
    ],
    difficulties: [
        { display: '1', value: 1 },
        { display: '2', value: 2 },
        { display: '3', value: 3 },
    ],
    priorities: [
        { display: '1', value: 1 },
        { display: '2', value: 2 },
        { display: '3', value: 3 }
    ],
};



// export { options };
