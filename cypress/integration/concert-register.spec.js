beforeEach(() => {
  cy.visit("https://concert-registration.vercel.app/");
});

describe("Webpage rendering", () => {
  it("should load the website", () => {
    cy.visit("https://concert-registration.vercel.app/");
  });

  it("Loads all the fields and labels", () => {
    cy.get("#field-1-label").should("have.text", "First Name");
    cy.get("#fname").should("exist");

    cy.get("#field-2-label").should("have.text", "Last Name");
    cy.get("#lname").should("exist");

    cy.get("#field-3-label").should("have.text", "Email address ");
    cy.get("#email").should("exist");

    cy.get("#field-4-label").should("have.text", "Age");
    cy.get("#field-4").should("exist");

    cy.get("#field-5-label").should("have.text", "Date & Tour");
    cy.get("#tour-opt").should("exist");

    cy.get("#field-10-label").should("have.text", "Select Seating");
    cy.get(".chakra-radio-group").should("exist");

    cy.get("#field-11-label").should("have.text", "# of ticket");
    cy.get("#field-12").should("exist");

    cy.get(".chakra-button").should("exist").and("have.text", "Submit");
  });

  it("Can select a tour and date", () => {
    cy.get('[name="tour"]').select("option1");
    cy.get('[name="tour"]').select("option2");
    cy.get('[name="tour"]').select("option3");
  });

  it("select a seating", () => {
    cy.get('#seat-opt [type="radio"]').check("1", { force: true });
    cy.get('#seat-opt [type="radio"]').check("2", { force: true });
    cy.get('#seat-opt [type="radio"]').check("3", { force: true });
  });
});

describe("Form submission", () => {
  context("Blank form Submission", () => {
    it("Submits and checks for blank validation", () => {
      cy.get(".chakra-button").click();
      cy.get("#field-1-feedback").should("have.text", "First name is required");
      cy.get("#field-2-feedback").should("have.text", "Last name is required");
      cy.get("#field-3-feedback").should("have.text", "Email is required");
      cy.get("#field-4-feedback").should("have.text", "Age is required");
      cy.get("#field-5-feedback").should(
        "have.text",
        "Tour and date is required"
      );
      cy.get("#field-10-feedback").should(
        "have.text",
        "Please select an option"
      );
      cy.get("#field-12-feedback").should(
        "have.text",
        "Number of ticket is required"
      );
    });
  });

  context("Invalid form inputs", () => {
    it("Does not allow age <16  ", () => {
      cy.get("#field-4").focus().type("15");
      cy.get(".chakra-button").click();
      cy.get("#field-4-feedback").should(
        "have.text",
        "Invalid age or too young"
      );
    });
    it("Does not allow negative age  ", () => {
      cy.get("#field-4").focus().type("-1");
      cy.get(".chakra-button").click();
      cy.get("#field-4-feedback").should(
        "have.text",
        "Invalid age or too young"
      );
    });

    it("Does not allow negative ticket  ", () => {
      cy.get("#field-12").focus().type("-1");
      cy.get(".chakra-button").click();
      cy.get("#field-12-feedback").should(
        "have.text",
        "Cannot reserve less than 1 ticket"
      );
    });

    it("Does not allow 0 ticket  ", () => {
      cy.get("#field-12").focus().type("0");
      cy.get(".chakra-button").click();
      cy.get("#field-12-feedback").should(
        "have.text",
        "Cannot reserve less than 1 ticket"
      );
    });

    it("Age <18 Cannot purchase >10 tickets", () => {
      cy.get("#field-4").focus().type("16");
      cy.get("#field-12").focus().type("11");
      cy.get(".chakra-button").click();
      cy.get("#field-12-feedback").should(
        "have.text",
        "Cannot by more than 10 tickets if age is below 18!"
      );
    });
  });
  context("Valid form submission", () => {
    it("submits a completed form Age >=18", () => {
      const formdata = {
        firstName: "Jenna",
        lastName: "Grant",
        email: "jgrant@memail.com",
        age: 18,
        tour: "option2",
        seat: "3",
        ticket: 12,
      };

      cy.get("#fname").type(formdata.firstName);

      cy.get("#lname").type(formdata.lastName);

      cy.get("#email").type(formdata.email);

      cy.get("#field-4").type(formdata.age);

      cy.get('[name="tour"]').select(formdata.tour);

      cy.get('#seat-opt [type="radio"]').check(formdata.seat, { force: true });

      cy.get("#field-12").type(formdata.ticket);

      cy.get(".chakra-button").click();

      cy.get("#chakra-modal--body-13 > p")
        .should("exist")
        .and("have.text", "Your ticket has been reserved!");
      // cy.get("#chakra-modal-13 > footer > button").click();

      cy;
    });
  });
});
