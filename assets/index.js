let recupdata = {
  banque: {
    agence: "Dioulabougo",
    siege: "Cocody Angre",
    iban: "5555555555",
    bic: "545ddghghd",
    logo: "https://lespagesvertesci.net/userfiles/image/f38072ef.jpg",
  },
  client: {
    fullName: "John Doe",
    adress: "123 Main Street",
    numero: "123456789",
    comptes: {
      courant: {
        numeroCompte: "C123456",
        solde: 1500,
        soldeMoisPrecedent: 1400,
        devise: "EUR",
        fraisBancaires: [
          {
            description: "Frais de service",
            montant: 10,
          },
          {
            description: "Frais de découvert",
            montant: 20,
          },
        ],
        transactions: [
          {
            id: "1",
            date: "2023-02-01",
            type: "debit",
            description: "Achat mensuel",
            montant: 100,
          },

          {
            id: "2",
            date: "2023-02-15",
            type: "credit",
            description: "Salaire",
            montant: 300,
          },
          {
            id: "3",
            date: "2023-02-18",
            type: "credit",
            description: "Depot regulier",
            montant: 800,
          },
          {
            id: "4",
            date: "2023-02-24",
            type: "debit",
            description: "Achat fourniture",
            montant: 2000,
          },
        ],
      },
      epargne: {
        numeroCompte: "E789012",
        solde: 5000,
        soldeMoisPrecedent: 4900,
        devise: "USD",

        transactions: [
          {
            id: "1",
            date: "2023-02-05",
            type: "debit",
            description: "Retrait ATM",
            montant: 50,
          },
          {
            id: "2",
            date: "2023-02-20",
            type: "credit",
            description: "Dépôt épargne",
            montant: 200,
          },
        ],
      },
    },
  },
  dateMoisPrecedent: "31 janvier 2023",
  relevePeriode: "1 au 28 février 2023",
  informationsSupplementaires:
    "Pour toute question ou information supplémentaire, veuillez contacter notre service client au 123-456-789. Nous vous remercions de votre confiance et restons à votre disposition pour tout besoin.",
};

let domParam = {
  banque: {
    agence: document.getElementById("agence"),
    siege: document.getElementById("siege"),
    iban: document.getElementById("iban"),
    bic: document.getElementById("bic"),
    logo: document.getElementById("logo-image"),
  },
  client: {
    nom: document.getElementById("nom-client"),
    adresse: document.getElementById("adresse-client"),
    numero: document.getElementById("numero-client"),
  },
  compte: {
    numeroCompte: document.getElementById("n-compte"),
    devise: document.getElementById("devise"),
    type: document.getElementById("type-releve"),
  },
  dates: {
    periode: document.getElementById("periode"),
    datePrecedente: document.getElementById("periode-precedente"),
  },

  soldes: {
    dernierDepot: document.getElementById("depot-mois-precedent"),
    soldeFinal: document.getElementById("solde-final"),
    soldeTotalFrais: document.getElementById("total-frais"),
  },
  autres: {
    tbodyTransactions: document.querySelector("table tbody"),
    tbodyFrais: document.querySelectorAll("table tbody")[1],
    date: document.getElementById("periode-echeante"),
    totalDebit: document.getElementById("total-debit"),
    totalCredit: document.getElementById("total-credit"),
    message: document.getElementById("message"),
    type: document.getElementById("choix-type"),
  },
};
let recupType = Object.keys(recupdata.client.comptes);

recupType.forEach((type) => {
  domParam.autres.type.innerHTML += `<option value="${type}">${type}</option>`;
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let typeCompte = domParam.autres.type.value;
  fillInvoice(typeCompte);
});

const fillInvoice = (type = "courant") => {
  domParam.autres.tbodyTransactions.innerHTML = "";
  domParam.autres.tbodyFrais.innerHTML = "";

  let totalDebit = 0;
  let totalCredit = 0;
  let debit = 0;
  let credit = 0;
  let totalFrais = 0;

  // header of invoice
  // domParam.banque.logo.setAttribute("src", recupdata.banque.logo);
  domParam.compte.type.textContent = type;
  domParam.banque.agence.textContent = recupdata.banque.agence.toUpperCase();
  domParam.banque.bic.textContent = recupdata.banque.bic.toLocaleUpperCase();
  domParam.banque.siege.textContent =
    recupdata.banque.siege.toLocaleUpperCase();
  domParam.banque.iban.textContent = recupdata.banque.iban.toLocaleUpperCase();
  domParam.client.adresse.textContent =
    recupdata.client.adress.toLocaleUpperCase();
  domParam.client.nom.textContent =
    recupdata.client.fullName.toLocaleUpperCase();
  domParam.client.numero.textContent =
    recupdata.client.numero.toLocaleUpperCase();

  domParam.compte.devise.textContent =
    recupdata.client.comptes[type].devise.toLocaleUpperCase();
  domParam.compte.numeroCompte.textContent =
    recupdata.client.comptes[type].numeroCompte.toLocaleUpperCase();
  //   domParam.compte.type.textContent = recupdata.compte.type.toLocaleUpperCase();
  domParam.dates.periode.textContent = recupdata.relevePeriode;

  // body of invoice
  domParam.dates.datePrecedente.textContent = recupdata.dateMoisPrecedent;

  domParam.soldes.dernierDepot.textContent =
    recupdata.client.comptes[type].soldeMoisPrecedent;
  domParam.autres.date.textContent = recupdata.relevePeriode.substring(2);

  recupdata.client.comptes[type].transactions.forEach((operation) => {
    if (operation.type === "debit") {
      debit = operation.montant;
      credit = "";
    } else if (operation.type === "credit") {
      credit = operation.montant;
      debit = "";
    } else return;

    domParam.autres.tbodyTransactions.innerHTML += ` <tr>
        <td>${operation.date}</td>
        <td>${operation.description}</td>
        <td>${debit}</td>
        <td>${credit}</td>
        </tr>
        </tr>`;

    if (credit !== "") totalCredit += credit;
    if (debit !== "") totalDebit += debit;
  });

  domParam.autres.totalDebit.textContent = totalDebit;
  domParam.autres.totalCredit.textContent =
    totalCredit + recupdata.client.comptes[type].soldeMoisPrecedent;
  let temp = domParam.autres.totalCredit.textContent;
  domParam.soldes.soldeFinal.textContent = temp - totalDebit;

  if (recupdata.client.comptes[type].fraisBancaires) {
    recupdata.client.comptes[type].fraisBancaires.forEach((operation) => {
      domParam.autres.tbodyFrais.innerHTML += `
      <tr>
      <td colspan="4" >${operation.description}</td>
      <td colspan="1" class="text-center">${operation.montant}</td>
      </tr>`;
      totalFrais += operation.montant;
    });
  } else {
    domParam.autres.tbodyFrais.innerHTML = `
    <tr>
    <td colspan="4" ></td>
    <td colspan="1" class="text-center"></td>
    </tr>`;
  }

  domParam.soldes.soldeTotalFrais.textContent = totalFrais;
  domParam.autres.message.textContent = recupdata.informationsSupplementaires;
};

// let structure = {
//   banque: {
//     agence: "",
//     siege: "",
//     iban: "",
//     bic: "",
//     logo: "",
//   },
//   client: {
//     fullName: "",
//     adress: "",
//     numero: "",
//     comptes: {
//       courant: {
//         numeroCompte: "",
//         solde: 0,
//         soldeMoisPrecedent: 0,
//         devise: "",
//         fraisBancaires: [
//           {
//             description: "",
//             montant: 0,
//           },
//           // Ajoute d'autres objets de frais bancaires au besoin
//         ],
//         transactions: [
//           {
//             id: "",
//             date: "",
//             type: "", // "debit" ou "credit"
//             description: "",
//             montant: 0,
//           },
//           // Ajoute d'autres objets de transactions au besoin
//         ],
//       },
//       epargne: {
//         numeroCompte: "",
//         solde: 0,
//         soldeMoisPrecedent: 0,
//         devise: "",
//         fraisBancaires: [
//           {
//             description: "",
//             montant: 0,
//           },
//           // Ajoute d'autres objets de frais bancaires au besoin
//         ],
//         transactions: [
//           {
//             id: "",
//             date: "",
//             type: "", // "debit" ou "credit"
//             description: "",
//             montant: 0,
//           },
//           // Ajoute d'autres objets de transactions au besoin
//         ],
//       },
//     },
//   },
//   dateMoisPrecedent: "",
//   relevePeriode: "",
//   informationsSupplementaires: "",
// };
