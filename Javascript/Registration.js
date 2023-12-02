document.getElementById('registerBtn').addEventListener('click', async () => {
    try {
        let displayName = document.getElementById('userDisplayName').value
        let email = document.getElementById('userEmail').value
        let password = document.getElementById('userPassword').value

        //CREATE USER
        let userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)

        //EXTRACT USER ID
        let uid = userCredential.user.uid

        //STORE USER DATA IN FIRESTORE DB
        await firebase.firestore().collection('users').doc(uid).set({
            userId: uid,
            userName: displayName,
            userEmail: email
        })

        window.location.href = '/Home.html'
        
    }
    catch (err) {
        console.error(err.message)
    }
})