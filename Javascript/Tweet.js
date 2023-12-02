firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const uid = user.uid
            const uri = decodeURIComponent(window.location.search)
            const selectedTweetId = uri.substring(1)

            console.log(selectedTweetId)

            // FETCH TWEET
            // CHECK USERS
            const userQuery = await firebase.firestore().collection('users').get()

            userQuery.forEach(async (userDoc) => {

                const currentUser = userDoc.data().userName
                const currentUserId = userDoc.data().userId

                // CHECK TWEETS
                const tweetQuery = await firebase.firestore().collection('tweets').get()
                let content = ''

                tweetQuery.forEach((tweetDoc) => {
                    const tweetUserId = tweetDoc.data().tweetOwner
                    const tweet = tweetDoc.data().tweet
                    const tweetId = tweetDoc.data().tweetId

                    console.log(tweet)

                    if (currentUserId == tweetUserId && tweetId == selectedTweetId) {
                        content += "<div class= tweetDisplay>";
                        content += "<div class= header>";
                        content += "<p>" + currentUser + "</p>";
                        content += "</div>";

                        content += "<div class= tweetContent>";
                        content += "<p>" + tweet + "</p>";
                        content += "</div>";
                        content += "</div>";
                    }
                })

                $("#tweetDisplay").append(content)
            })





            // SEND COMMENT
            document.getElementById('sendComment').addEventListener('click', async () => {
                const commentText = document.getElementById('comment').value
                const commnetUserId = uid
                const timestamp = new Date()

                const commentRef = firebase.firestore().collection('comments').doc()

                try {
                    await commentRef.set({
                        comment: commentText,
                        userId: commnetUserId,
                        timePosted: timestamp,
                        tweetId: selectedTweetId
                    })

                    window.location.reload()
                }
                catch (error) {
                    console.error(error.message)
                }
            })

        }

        catch (error) {
            console.error(error.message)
        }
    }

})