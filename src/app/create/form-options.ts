// let options = [1, 2, 3];

export const options = {

    hours: Array.apply(0, Array(24))
        .map(function(_, i) { return i - 1; }),
    minutes: Array.apply(0, Array(60))
        .map(function(_, i) { return i - 1; }),

    type: [
        { display: 'habit', value: 'habit' },
        { display: 'incident', value: 'incident' },
    ],
    start_types: [
        { display: 'auto', value: 'auto' },
        { display: 'today', value: 'today' },
        { display: 'set date', value: 'date' },
        { display: 'first free day', value: 'first' },
    ],
    end_units: [
        { display: 'days', value: 'day' },
        { display: 'weeks', value: 'week' },
        { display: 'months', value: 'month' },
        { display: 'times', value: 'times' },
        { display: 'set date', value: 'date' }
    ],
    frequency_units: [
        { display: 'daily', value: 'day' },
        { display: 'weekly', value: 'week' },
        { display: 'monthly', value: 'month' },
    ],
    weekdays: [
        { display: 'Any', value: null },
        { display: 'Sun', value: 0 },
        { display: 'Mon', value: 1 },
        { display: 'Tue', value: 2 },
        { display: 'Wed', value: 3 },
        { display: 'Thu', value: 4 },
        { display: 'Fri', value: 5 },
        { display: 'Sat', value: 6 },
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
