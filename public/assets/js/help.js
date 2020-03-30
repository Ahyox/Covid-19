$(document).ready(function () {
    //validateBVN("22277597520"); // 0037153299
    loadHelps();
});

let NO_OF_PULL = 20;
function loadHelps() {
    $('#loading').show();
    firebase.database().ref('helps').limitToLast(NO_OF_PULL).orderByChild('helped').equalTo(false).once('value', function (snapshot) {
        if (snapshot.numChildren() <= 0) {
            //No help at the moment
            console.log('no help');
            $('#loading').hide();
            $('#help-cards').append('<p style="text-align: center;">No help request at the moment, be the first to make a request and someone might be around the corner trying to help</p>');
        } else {
            $('#loading').hide();
            //var eventId = snapshot.key;
            snapshot.forEach(function (childSnapshot) {
                var username = childSnapshot.val().username;
                var amount = childSnapshot.val().amount;
                var description = childSnapshot.val().description;
                var bank = childSnapshot.val().bank;
                var accountNo = childSnapshot.val().accountNo;

                lastHelpId = childSnapshot.key;
                var content = `<div class="card full-width" style="margin-top: 20px;">
                <div class="card-body">
                    <div class="row justify-content-between">
                        <div class="col-8">
                            <p><strong style="color: blue;">${username}</strong></p>
                        </div>
                        <div class="col-4">
                            <strong>Amount: <span style="color: #c00;">N${amount}</span></strong>
                        </div> 
                    </div>
                    <p class="multiline3">${description}</p>
                    <div class="row" style="margin-bottom:10px;">
                       <div class="col-sm-4"></div>
                       <div class="col-sm-5"></div>
                       <div class="col-sm-3">
                           <a href="javascript:void(0);" class="markAsPaid" uid="${childSnapshot.key}">Mark as Paid</a>
                       </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-7">
                            <strong>Account No:</strong> <span style="color: #c00;">${accountNo}</span>
                        </div>
                        <div class="col-5">
                            <strong>Bank Name:</strong> <span style="color: #c00;">${bank}</span>
                        </div>
                    </div>
                </div>
            </div>`;

                $('#help-cards').append(content);

            });
        }
    });
}

$("#help-cards").on('click', '.markAsPaid', function (e) {
    e.preventDefault();
    $('#loading').show();
    let uid = $(this).attr('uid');

    var updateData = {};
    updateData['helps/' + uid + '/helped'] = true;
    firebase.database().ref().update(updateData)
        .then(function () {
            $('#loading').hide();
            alert("Thank you for helping this user. We pray the good Lord help you and your family");
            location.href = 'help.html';
        })
        .catch(function (error) {
            $('#loading').hide();
            alert("Please try again");
        });
});

var bvn;
var accountNo;
var username;
var bankName;
var lastHelpId;
function validateBVN(bvnNo, account, bankCode, firstName, lastName) {
    bvn = bvnNo;
    accountNo = account;
    //$('#loading').show();

    username = firstName + " " + lastName;
    //console.log(username);
    $('#validateBtnFrame').hide();
    $('#help-info-frame').show();
    $('#onSubmitHelp').show();

    /* Uncomment if you want to verify bvn
    $.ajax({
        url: 'https://api.paystack.co/bvn/match',
        type: 'POST',
        headers: {
            "Authorization": "Bearer " + "{Secrete_key}}"
        },
        data: { account_number: account, bank_code: bankCode, bvn: bvn, first_name: firstName, last_name: lastName },

        success: function (result) {
            $('#loading').hide();
            //console.log(result);
            var status = result.status;
            var message = result.message; //BVN resolved
            username = firstName + " " + lastName;
            //console.log(username);
            if (result.data.account_number && message === "BVN lookup successful") {
                $('#validateBtnFrame').hide();
                $('#help-info-frame').show();
                $('#onSubmitHelp').show();
            }
        },
        error: function (error) {
            $('#loading').hide();
            console.log("error", error);
        }
    });
    */
}

$('.helpBtn').click(function () {
    $('#helpDialog').show();
});

$('#closeBtn').click(function () {
    $('#helpDialog').hide();
});

$('.validateBtn').click(function () {
    var bvn = $('#bvn').val();
    var accountNo = $('#accountNo').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var bankCode = $('#bank').val();
    bankName = $('#bank option:selected').html();

    console.log(bvn, accountNo, firstName, lastName, bankCode);
    if (bvn === '') {
        $('#bvn').focus();
        return;
    } else if (accountNo === '') {
        $('#accountNo').focus();
        return;
    } else if (firstName === '') {
        $('#firstName').focus();
        return;
    } else if (lastName === '') {
        $('#lastName').focus();
        return;
    } else if (bankCode === '') {
        $('#bankCode').focus();
        return;
    }
    validateBVN(bvn, accountNo, bankCode, firstName, lastName);
});

$('#onSubmitHelp').click(function () {
    var amount = $('#amount').val();
    var description = $('#sDescription').val();


    //console.log(bankName, amount, description);
    if (amount === '') {
        $('#amount').focus();
        return;
    } else if (description === '') {
        $('#sDescription').focus();
        return;
    } else if (!$('#check').is(":checked")) {
        alert("You need to check the checkbox to continue.");
        return;
    }

    saveHelp(bankName, amount, description);
});

function saveHelp(bankName, amount, description) {
    $('#loading').show();

    var helpData = {};
    var data = {
        username: username,
        bank: bankName,
        amount: amount,
        accountNo: accountNo,
        description: description,
        helped: false
    }

    helpData['helps/' + bvn] = data;
    firebase.database().ref().update(helpData)
        .then(function () {
            $('#loading').hide();
            alert("Help was successfuly accepted. Wait someone might help you in a gifree");
            $('#helpDialog').hide();
            location.href = 'help.html';
        })
        .catch(function (error) {
            console.log(error.message);
            $('#loading').hide();
            if (error.message === 'PERMISSION_DENIED: Permission denied') {
                alert("You've already been helped, please let others benefit too. God bless you");
                $('#helpDialog').hide();
                location.href = 'help.html';
            } else {
                alert("Help request wasn't successful, please try again");
            }
        });
}


//Check if scrolled to the buttom of the page
$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        loadMoreHelp() 
    }
});

function loadMoreHelp() {
    firebase.database().ref('helps/').limitToLast(NO_OF_PULL).startAt(lastHelpId).once('value', function (snapshot) {
        if (snapshot.numChildren() <= 0) {
            //No help at the moment
            console.log('no help');
        } else {
            $('#loading').hide();
            //var eventId = snapshot.key;
            snapshot.forEach(function (childSnapshot) {
                var username = childSnapshot.val().username;
                var amount = childSnapshot.val().amount;
                var description = childSnapshot.val().description;
                var bank = childSnapshot.val().bank;
                var accountNo = childSnapshot.val().accountNo;

                lastHelpId = childSnapshot.key;
                var content = `<div class="card full-width" style="margin-top: 20px;">
                <div class="card-body">
                    <div class="row justify-content-between">
                        <div class="col-8">
                            <p><strong style="color: blue;">${username}</strong></p>
                        </div>
                        <div class="col-4">
                            <strong>Amount: <span style="color: #c00;">N${amount}</span></strong>
                        </div> 
                    </div>
                    <p class="multiline3">${description}</p>
                    <div class="row">
                       <div style="float:right; margin-bottom:10px;">
                       <a href="javascript:void(0);" class="markAsPaid" uid="${childSnapshot.key}">Mark as Paid</a>
                       </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-7">
                            <strong>Account No:</strong> <span style="color: #c00;">${accountNo}</span>
                        </div>
                        <div class="col-5">
                            <strong>Bank Name:</strong> <span style="color: #c00;">${bank}</span>
                        </div>
                    </div>
                </div>
            </div>`;

                $('#help-cards').append(content);

            });
        }

    });
}