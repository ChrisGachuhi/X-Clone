document.getElementById('loginBtn').addEventListener('click', async () => {
    try {
        let email = document.getElementById('userEmail').value
        let password = document.getElementById('userPassword').value

        let userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)

        let user = userCredential.user
        console.log(user)

        window.location.href = '/Home.html'

    }
    catch (err) {
        console.error(err.message)
    }

})