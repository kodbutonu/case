
    $(document).ready(function () {
        listFlights();
        fillAirportDropdowns();
    });

    function listFlights() {
        // API isteği gönderip verileri #flightListTable'e ekleyebilirsiniz
        const apiUrl = '/flights';
        $('#loading').show();
    
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (data) {
                // API'den gelen verileri işleyerek tabloyu güncelle
                displayFlights(data);
                $('#loading').hide();
            },
            error: function (error) {
                console.error('Uçuşları getirirken bir hata oluştu:', error);
                alert('Uçuşları getirirken bir hata oluştu.');
                $('#loading').hide();
            }
        });
    }
    

    function displayFlights(data) {
        const flightTable = $('#flightListTable');

        // Tabloyu temizle
        flightTable.empty();

        // Tablo başlığını oluştur
        const tableHeader = $('<thead class="thead-dark"><tr><th>Havayolu</th><th>Şehir</th><th>Kalkış Saati</th><th>Varış Saati</th><th>Fiyat</th></tr></thead>');
        flightTable.append(tableHeader);

        // Verileri tabloya ekle
        const tableBody = $('<tbody>');
        data.flights.forEach(flight => {
            const row = $('<tr>');
            row.append($('<td>').text(flight.airline));
            row.append($('<td>').text(flight.city));
            row.append($('<td>').text(flight.departureTime));
            row.append($('<td>').text(flight.arrivalTime));
            row.append($('<td>').text(flight.price));
            tableBody.append(row);
        });

        flightTable.append(tableBody);
    }

    function fillAirportDropdowns() {
        const airports = ["İstanbul", "Ankara", "İzmir", "Antalya", "Adana", "Eskişehir", "Bursa", "Trabzon", "Gaziantep", "Hatay"];
        fillDropdown("departureAirport", airports);
        fillDropdown("arrivalAirport", airports);
        fillDateDropdown("departureDate");
        fillDateDropdown("returnDate");
    }

    function fillDropdown(id, options) {
        const dropdown = $("#" + id);
        dropdown.empty();

        options.forEach(option => {
            dropdown.append($("<option>").text(option));
        });
    }

    function fillDateDropdown(id) {
        const dropdown = $("#" + id);
        dropdown.empty();

        // Bugünün tarihinden itibaren 7 gün ekleyerek bir haftalık bir dönemi doldur
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            dropdown.append($("<option>").text(formattedDate).val(formattedDate));
        }
    }

    function searchFlights() {
        const departureAirport = $('#departureAirport').val();
        const arrivalAirport = $('#arrivalAirport').val();
        const departureDate = $('#departureDate').val();
        const returnDate = $('#returnDate').val();
        const oneWay = $('#oneWay').prop('checked');

        // Havaalanı ve tarih validasyonları
        if (!departureAirport || !arrivalAirport || !departureDate) {
            alert('Lütfen kalkış havaalanı, varış havaalanı ve kalkış tarihini seçin.');
            return;
        }

        // Dönüş tarihi validasyonu
        if (!oneWay && !returnDate) {
            alert('Lütfen dönüş tarihini seçin.');
            return;
        }

        // API isteği için gerekli parametreleri oluştur
        const apiUrl = '/api/flights';
        const requestData = {
            departureAirport,
            arrivalAirport,
            departureDate,
            returnDate,
            oneWay,
        };

        // Yükleniyor mesajını göster
        $('#loading').show();

        // API isteği gönder
        $.ajax({
            url: apiUrl,
            method: 'GET',
            data: requestData,
            success: function (data) {
                // API'den gelen verileri işleyerek tabloyu güncelle
                displayFlights(data);

                // Yükleniyor mesajını gizle
                $('#loading').hide();
            },
            error: function (error) {
                // Hata durumunda kullanıcıya bilgi ver
                alert('Uçuşları getirirken bir hata oluştu.');

                // Yükleniyor mesajını gizle
                $('#loading').hide();
            }
        });
    }

