var myHeaders = new Headers();

var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
};

fetch('response.json', myInit)
    .then(response => {
        return response.json()
    })
    .then(data => {
        // Work with JSON data here and check code HTTP
        if (data.code) {

            data = data.data.booking;
            data.forEach(booking => {

                element = document.getElementById("informations-booking");

                // Def des vars
                const status = booking.xStatus;
                const code = booking.code;

                // Nom du client
				if (booking.customer.firstName === undefined) {
                    clientName = 'Non renseigné';
                }else{
	                clientName = booking.customer.firstName + ' ' + booking.customer.lastName;
                }

                if (booking.begin === undefined) {
                    date = 'Non renseigné';
                } else {
                    var start = new Date(booking.begin);
                    var end = new Date(booking.end);
                    var options = {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    var lang = 'FR';

                    date = 'Du ' + start.toLocaleDateString(lang, options) + ' au ' + end.toLocaleDateString(lang, options);
                }

                // Get nombre de voayageuur +1 on demarre a 0
                booking.traveller.forEach(function(element, index) {
                    nbrTravaller = index + 1;
                });

                // Get le prix
                if (booking.total === undefined) {
                    amount = 'Non renseigné';
                } else {
                    booking.total.forEach(function(element) {
                        amount = element.amount + ' ' + element.currency;
                    });
                }

                // Get intineray
                if (booking.sector === undefined) {
                    itineraire = 'Non renseigné';
                } else {
                    itineraire = '';

                    // gestion itineraire test si airport de départ = celui ou l'on vient d'arriver
                    for (i = 0; i < booking.sector.length; i++) {
                        if (i > 0) {
                            var testBefore = i - 1;
                            if (booking.sector[i].from.airport.code == booking.sector[testBefore].to.airport.code) {
                                itineraire += ' <img src="img/arrow-right-solid.svg" alt="arrow right" height="12px"> ' + booking.sector[i].to.airport.code + ' ';

                            } else {
                                itineraire += booking.sector[i].from.airport.code + ' <img src="img/arrow-right-solid.svg" alt="arrow right" height="12px"> ' + booking.sector[i].to.airport.code + '  ';

                            }
                        } else {
                            itineraire += booking.sector[i].from.airport.code + ' <img src="img/arrow-right-solid.svg" alt="arrow right" height="12px"> ' + booking.sector[i].to.airport.code;

                        }

                    }
                }


                trContent = eachBookingTemplate
                    .replace(/{{renderStatus}}/g, status)
                    .replace('{{renderCode}}', code)
                    .replace('{{renderClientName}}', clientName)
                    .replace('{{rendernBrTravaller}}', nbrTravaller + ' voyageurs')
                    .replace('{{renderAmount}}', amount)
                    .replace('{{renderItineraire}}', itineraire)
                    .replace('{{renderDate}}', date);

                document.getElementById("informations-booking").insertAdjacentHTML("afterbegin", trContent);
            });
        } else {
            console.log('Mauvaise réponse du réseau')
            document.getElementById("afidium_wrapper").innerHTML = noReseau;
        }
        $('#afidium').dataTable({
            "language": {
               "language": {
               	// Translation pour le tableau existe plsrs langues
                   // "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/French.json"
               }
            }
        });
    })
    .catch(function(error) {
        // Do something for an error
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        document.getElementById("afidium_wrapper").innerHTML = erreurMessage;
    })



var eachBookingTemplate = "<tr>\n" +
    "<td data-sort=\"{{renderStatus}}\"><img src=\"img/{{renderStatus}}.svg\" height=\"18px\"width=\"18px\" /> \n" +
    "<span>{{renderCode}}</span>\n" +
    "</td>\n" +
    "<td>{{renderClientName}}</td>\n" +
    "<td>{{rendernBrTravaller}}</td>\n" +
    "<td>{{renderItineraire}}</td>\n" +
    "<td>{{renderDate}}</td>\n" +
    "<td>{{renderAmount}}</td>\n" +
    "</tr>";

var noReseau = '<img src="img/reseau.png" alt="image pas de reseau" height="250px"> <h1 class="text-center">Erreur de réseau</h1>';

var erreurMessage = '<h1 class="text-center color-error">Il y a eu un problème avec l\'opération fetch</h1>';