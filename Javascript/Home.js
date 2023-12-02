// CHECK AUTHENTICATION STATE
firebase.auth().onAuthStateChanged(async (user) => {
    // DISPLAY PAGE IF SIGNED IN
    if (user) {
        try {
            document.getElementById('logoutBtn').addEventListener('click', async () => {
                try {
                    await firebase.auth().signOut()
                    window.location.href = '/Login.html'
                }
                catch (err) {
                    console.error(err.message)
                }
            })

            let uid = user.uid
            let email = user.email

            //DOCUMENT REFERRENCE
            const docRef = await firebase.firestore().collection('users').doc(uid).get()

            let username = docRef.data().userName
            let useremail = docRef.data().userEmail

            document.getElementById('email').innerHTML = useremail
            document.getElementById('username').innerHTML = username


            // COLLECT AND STORE TWEET TO 'tweets' COLLECTION IN FIRESTORE
            // APPEND: text, userId, tweetId, time
            document.getElementById('sendTweet').addEventListener('click', async () => {
                try {
                    let tweetContent = document.getElementById('tweet').value
                    let time = new Date()

                    const tweetRef = firebase.firestore().collection('tweets').doc()

                    await tweetRef.set({
                        tweet: tweetContent,
                        timestamp: time,
                        tweetOwner: uid,
                        tweetId: tweetRef.id,
                        tweetAuthor: username
                    })

                    window.location.reload()

                }
                catch (err) {
                    console.log(err.message)
                }
            })


            // FETCH & DISPLAY TWEET DATA TO THE DOM
            const loadTweets = async () => {
                try {
                    //CHECKING ALL THE USERS
                    const userQuery = await firebase.firestore().collection('users').get()

                    // GETTING USER INFO
                    userQuery.forEach(async (userDoc) => {
                        const username = userDoc.data().userName
                        const userId = userDoc.data().userId

                        const tweetQuery = await firebase.firestore().collection('tweets').get()

                        let content = ''

                        tweetQuery.forEach(async (tweetDoc) => {
                            const tweetContent = tweetDoc.data().tweet
                            const tweetAuthorId = tweetDoc.data().tweetOwner
                            const tweetId = tweetDoc.data().tweetId
                            const tweetAuthor = tweetDoc.data().tweetAuthor


                            // console.log(tweetId)

                            if (userId == tweetAuthorId) {
                                content += '<div id="tweetContainer" class="tweet" onclick="handleTweetNavigation(\' ' + tweetId + ' \')">'
                                content += '<div class="header">'
                                content += '<h4>' + tweetAuthor + '</h4>'
                                content += '</div>'

                                content += '<div class="body">'
                                content += '<p>' + tweetContent + '</p>'
                                content += '</div>'

                                content += '</div>'

                            }
                        })

                        $("#tweetContainer").append(content)

                    })

                    window.handleTweetNavigation = (tweetId) => {
                        window.open(`tweet.html?${tweetId}`, '_blank')
                    }

                }
                catch (err) {
                    console.log(err.message)
                }
            }

            loadTweets()

        }

        catch (err) {
            console.log(err.message)
        }
    }

    else {
        //  NAVIGATE TO LOGIN IF NOT SIGNED IN

        window.location.href = '/Login.html'
    }
})