let single = function() {
    cy.visit('http://localhost:8100');
    cy.window().then((w) => {
        w.mdSet('2020-02-11');
        cy.get('#add').click();
        cy.get('#add').click();
        cy.get('#done').click();
    })
}
let expectStats = function(daily, monthly, weekly, times) {
    cy.get('#Daily-stat')
        .should('have.text', daily + '%')
    cy.get('#Monthly-stat')
        .should('have.text', monthly + '%')
    cy.get('#Weekly-stat')
        .should('have.text', weekly + '%')
    cy.get('#Times-stat')
        .should('have.text', times)
}

let getComponent = function(n) {
    return cy.window().then((w) => {
        return w._appContext[n];
    });
}

let setForm = function(w, name, value) {
    w._appContext.form.controls[name].setValue(value);
}

let fourDays = function() {
    cy.visit('http://localhost:8100');
    cy.window().then((w) => {
        w.mdSet('2020-02-11');
    })
    cy.get('#add').click();
    cy.get('#timer-btn');
    cy.window().then((w) => {
        setForm(w, 'start_type', 'today');
        setForm(w, 'end_units', 'day');
        setForm(w, 'end_quantity', 4);
    });
    cy.get('#done').click();
}

it.only('shows completion stats for one habit', function() {
    fourDays();
    cy.get('#tab-button-reports').click();
    // cy.get('.awaiting').first().click();
    getComponent('report-calendar').then((c) => {
        c.toggleTaskStatus(c.h.tasks[0]);
    })

});

it('shows stats at 0', function() {
    fourDays();
    cy.get('#tab-button-reports').click();
    expectStats("0.0", "0.0", "0.0", "0/1");
});

it('calendar shows correct number of days', function() {
    fourDays();
    cy.get('#tab-button-reports').click();
    cy.get('#report-calendar .calendar-day.awaiting')
        .should((els) => {
            expect(els).to.have.length(5)
            expect(els[0]).to.contain('11');
            expect(els[1]).to.contain('12');
            expect(els[2]).to.contain('13');
            // expect(els[1]).to.contain('14');
            // console.log('el', els[0]);
        });
});
