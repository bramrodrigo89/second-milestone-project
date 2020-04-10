function sendMail(contactForm) {
   
    var templateParams = {
        "from_firstName": contactForm.firstName.value, 
        "from_lastName": contactForm.lastName.value, 
        "from_email": contactForm.email.value, 
        "comment_question_inquiry": contactForm.freeText.value, 
        "from_phoneNumber": contactForm.phoneNumber.value, 
    };
    
    emailjs.send("gmail", "mystockdashboardcontactform", templateParams)
    
	.then(
        function(response) {
            $('#thank-you-alert').show();
		    console.log('SUCCESS!', response.status, response.text);
        },
        function(error) {
            console.log('FAILED...', error);
        }
    );
    return false; //blocks loading a new page
}