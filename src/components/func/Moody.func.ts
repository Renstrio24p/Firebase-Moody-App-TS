import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth"
import { app, auth, db, provider } from "../../assets/firebase/DatabaseConfig"
import { ErrorType, PostType, UserType } from "../../assets/firebase/FirebaseTypes"
import { DefaultProfileImg } from "../Images"
import { CollectionOfButtons, DateType, EventTypes, InputTypes, MonthTypes, stringNumbers } from "../types/TypeOf"
import { Query, addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore"

export const useMoody = () => {

    if (app) {
        console.log('Firebase Connected Successfully..')
    } else {
        console.log(`Firebase Doesn't Respond.`)
    }


    const viewLoggedOut = document.getElementById("logged-out-view") as HTMLDivElement | null
    const viewLoggedIn = document.getElementById("logged-in-view") as HTMLDivElement | null

    const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn") as HTMLButtonElement | null

    const emailInputEl = document.getElementById("email-input") as HTMLInputElement | null
    const passwordInputEl = document.getElementById("password-input") as HTMLInputElement | null

    const signInButtonEl = document.getElementById("sign-in-btn") as HTMLButtonElement
    const createAccountButtonEl = document.getElementById("create-account-btn") as HTMLButtonElement

    const signOutButtonEl = document.getElementById("sign-out-btn") as HTMLButtonElement | null
    const userProfilePictureEl = document.getElementById("user-profile-picture") as HTMLImageElement | null

    const userGreetingEl = document.getElementById("user-greeting") as HTMLHeadingElement | null

    const displayNameInputEl = document.getElementById("display-name-input") as HTMLInputElement | null
    const photoURLInputEl = document.getElementById("photo-url-input") as HTMLInputElement | null
    const updateProfileButtonEl = document.getElementById("update-profile-btn") as HTMLButtonElement | null

    const moodEmojiEls = document.getElementsByClassName("mood-emoji-btn") as CollectionOfButtons | null
    const textareaEl = document.getElementById("post-input") as HTMLTextAreaElement | null
    const postButtonEl = document.getElementById("post-btn") as HTMLButtonElement | null

    const allFilterButtonEl = document.getElementById("all-filter-btn") as HTMLButtonElement | null

const filterButtonEls = document.getElementsByClassName("filter-btn") as HTMLCollectionOf<HTMLButtonElement> | null

    const postsEl = document.getElementById("posts") as HTMLDivElement | null

    /* == UI - Event Listeners == */

    signInWithGoogleButtonEl?.addEventListener("click", authSignInWithGoogle)

    signInButtonEl?.addEventListener("click", authSignInWithEmail)
    createAccountButtonEl?.addEventListener("click", authCreateAccountWithEmail)

    signOutButtonEl?.addEventListener("click", authSignOut)

    updateProfileButtonEl?.addEventListener("click", authUpdateProfile)

    const moodEmojiArray: HTMLButtonElement[] = Array.from(moodEmojiEls!);

    for (let moodEmojiEl of moodEmojiArray) {
        moodEmojiEl.addEventListener("click", selectMood);
    }

    const filterAllButtons: HTMLButtonElement[] = Array.from(filterButtonEls!)

    for (let filterButtonEl of filterAllButtons) {
        filterButtonEl.addEventListener("click", selectFilter)
    }

    postButtonEl?.addEventListener("click", postButtonPressed)


    /* === State === */

    let moodState = 0

    /* === Global Constants === */

    const collectionName = "posts"

    /* === Main Code === */

    onAuthStateChanged(auth, (user) => {
        if (user) {
            showLoggedInView()
            showProfilePicture(userProfilePictureEl!, user as UserType)
            showUserGreeting(userGreetingEl!, user as UserType)
            updateFilterButtonStyle(allFilterButtonEl!)
            fetchAllPosts(user as UserType)
        } else {
            showLoggedOutView()
        }
    });


    /* === Functions === */

    /* = Functions - Firebase - Authentication = */

    function authSignInWithGoogle() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                console.log(token, user)
            }).catch((error: ErrorType) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.error(errorCode, errorMessage, email, credential)
            });
    }

    function authSignInWithEmail() {

        const email = emailInputEl?.value
        const password = passwordInputEl?.value

        signInWithEmailAndPassword(auth, email!, password!)
            .then((userCredential) => {
                console.log(userCredential)
            })
            .catch((error: ErrorType) => {
                console.error(error.message)
            });
    }

    function authCreateAccountWithEmail() {

        const email = emailInputEl?.value
        const password = passwordInputEl?.value

        createUserWithEmailAndPassword(auth, email!, password!)
            .then((userCredential) => {
                clearAuthFields()
                console.log(userCredential)
            })
            .catch((error: ErrorType) => {
                console.error(error.message)
            });
    }

    function authSignOut() {
        signOut(auth).then(() => {
            clearAuthFields()
        }).catch((error: ErrorType) => {
            console.error(error.message)
        });
    }

    async function addPostToDB(postBody: InputTypes | string, user: UserType) {
        try {
            const docRef = await addDoc(collection(db, "posts"), {
                body: postBody,
                uid: user.uid,
                createdAt: serverTimestamp(),
                mood: moodState
            })
            console.log("Document written with ID: ", docRef.id)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    async function updatePostInDB(docId: string, newBody: PostType | string) {
      
        const postRef = doc(db, collectionName, docId);
    
        await updateDoc(postRef, {
            body: newBody
        })
    }

    async function deletePostFromDB(docId: string) {
          await deleteDoc(doc(db, collectionName, docId));
    }

    /* == Functions - UI Functions == */

    function postButtonPressed() {
        const postBody = textareaEl!.value
        const user = auth.currentUser
        if (postBody && moodState) {
            addPostToDB(postBody, user as UserType)
            clearInputField(textareaEl!)
            resetAllMoodElements(moodEmojiEls!)
        }
    }

    function showLoggedOutView() {
        hideView(viewLoggedIn!)
        showView(viewLoggedOut!)
    }

    function showLoggedInView() {
        hideView(viewLoggedOut!)
        showView(viewLoggedIn!)
    }

    function showView(view: HTMLElement) {
        view.style.display = "flex"
    }

    function hideView(view: HTMLElement) {
        view.style.display = "none"
    }

    function clearInputField(field: InputTypes) {
        field!.value = ""
    }

    function clearAuthFields() {
        clearInputField(emailInputEl!)
        clearInputField(passwordInputEl!)
    }

    function showProfilePicture(imgElement: HTMLImageElement, user: UserType) {

        const photoURL = user.photoURL

        if (photoURL) {
            imgElement.src = photoURL
        } else {
            imgElement.src = DefaultProfileImg.image
            imgElement.alt = DefaultProfileImg.alt
        }
    }

    function showUserGreeting(element: HTMLHeadingElement, user: UserType) {
        if (user !== null) {
            // The user object has basic properties such as display name, email, etc.
            const displayName = user.displayName;
            //   const email = user.email;
            //   const photoURL = user.photoURL;
            //   const emailVerified = user.emailVerified;
            //   const uid = user.uid;

            if (displayName) {
                const userFirstName = displayName.split(" ")[0]
                element.textContent = `Hey ${userFirstName}, how are you?`
            } else {
                element.textContent = `Hey friend, how are you?`
            }

        }
    }

    function displayDate(firebaseDate: DateType) {

        if (!firebaseDate) {
            return "Date is processing at the moment"
        }

        const date = firebaseDate.toDate()
        
        const day = date.getDate()
        const year = date.getFullYear()
        
        const monthNames: MonthTypes = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const month = monthNames[date.getMonth()]
    
        let hours: stringNumbers = date.getHours()
        let minutes: stringNumbers = date.getMinutes()
        hours = hours < 10 ? "0" + hours : hours
        minutes = minutes < 10 ? "0" + minutes : minutes
    
        return `${day} ${month} ${year} - ${hours}:${minutes}`
    }

   
function createPostHeader(postData: PostType) {
    /*
        <div class="header">
        </div>
    */
    const headerDiv = document.createElement("div")
    headerDiv.className = "header"
    
        /* 
            <h3>21 Sep 2023 - 14:35</h3>
        */
        const headerDate = document.createElement("h3")
        headerDate.textContent = displayDate(postData.createdAt)
        headerDiv.appendChild(headerDate)
        
        /* 
            <img src="assets/emojis/5.png">
        */
        const moodImage = document.createElement("img")
        moodImage.src = `images/emojis/${postData.mood}.png`
        headerDiv.appendChild(moodImage)
        
    return headerDiv
}

function createPostDeleteButton(wholeDoc: PostType) {
    const postId = wholeDoc.id
    
    /* 
        <button class="delete-color">Delete</button>
    */
    const button = document.createElement('button')
    button.textContent = 'Delete'
    button.classList.add("delete-color")
    button.addEventListener('click', function() {
        deletePostFromDB(postId as string)
        //deletePostFromDB(postId)
    })
    return button
}

function createPostBody(postData: PostType) {
    /*
        <p>This is a post</p>
    */
    const postBody = document.createElement("p")
    postBody.innerHTML = replaceNewlinesWithBrTags(postData.body)
    
    return postBody
}

function createPostUpdateButton(wholeDoc: PostType) {
    /* 
        <button class="edit-color">Edit</button>
    */

        const postId = wholeDoc.id
        const postData = wholeDoc.data()

    const button = document.createElement("button")
    button.textContent = "Edit"
    button.classList.add("edit-color")
    button.addEventListener("click", function() {
        const newBody = prompt("Edit the post", postData.body)
        
        if (newBody) {
            updatePostInDB(postId as string, newBody)
        }
    })
    
    return button
}

function createPostFooter(wholeDoc: PostType) {
    /* 
        <div class="footer">
            <button>Edit</button>
        </div>
    */
    const footerDiv = document.createElement("div")
    footerDiv.className = "footer"
    
    footerDiv.appendChild(createPostUpdateButton(wholeDoc))
    footerDiv.appendChild(createPostDeleteButton(wholeDoc))
    
    return footerDiv
}

function renderPost(postsEl: HTMLDivElement, wholeDoc: PostType) {
    const postData = wholeDoc.data() as PostType
    
    const postDiv = document.createElement("div")
    postDiv.className = "post"
    
    postDiv.appendChild(createPostHeader(postData))
    postDiv.appendChild(createPostBody(postData))
    postDiv.appendChild(createPostFooter(wholeDoc))
    
    postsEl.appendChild(postDiv)
}

    function replaceNewlinesWithBrTags(inputString: string) {
        return inputString.replace(/\n/g, "<br>")
    }

    function clearAll(element: HTMLDivElement) {
        element.innerHTML = ""
    }

    function fetchInRealtimeAndRenderPostsFromDB(query: Query, _user?: UserType) {
        onSnapshot(query, (querySnapshot) => {
            clearAll(postsEl!)
            
            querySnapshot.forEach((doc) => {
                renderPost(postsEl!, doc as unknown as PostType)
            })
        })
    }
    
    function fetchTodayPosts(user: UserType) {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)
        
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)
        
        const postsRef = collection(db, collectionName)
        
        const q = query(postsRef, where("uid", "==", user.uid),
                                  where("createdAt", ">=", startOfDay),
                                  where("createdAt", "<=", endOfDay),
                                  orderBy("createdAt", "desc"))

        fetchInRealtimeAndRenderPostsFromDB(q, user) 
                                  
    }

    function fetchWeekPosts(user: UserType) {
        const startOfWeek = new Date()
        startOfWeek.setHours(0, 0, 0, 0)
        
        if (startOfWeek.getDay() === 0) { // If today is Sunday
            startOfWeek.setDate(startOfWeek.getDate() - 6) // Go to previous Monday
        } else {
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
        }
        
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)
        
        const postsRef = collection(db, collectionName)
        
        const q = query(postsRef, where("uid", "==", user.uid),
                                  where("createdAt", ">=", startOfWeek),
                                  where("createdAt", "<=", endOfDay),
                                  orderBy("createdAt", "desc"))
                                  
        fetchInRealtimeAndRenderPostsFromDB(q, user)
    }

    function fetchMonthPosts(user: UserType) {
        const startOfMonth = new Date()
        startOfMonth.setHours(0, 0, 0, 0)
        startOfMonth.setDate(1)
    
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)
    
        const postsRef = collection(db, collectionName)
        
        const q = query(postsRef, where("uid", "==", user.uid),
                                  where("createdAt", ">=", startOfMonth),
                                  where("createdAt", "<=", endOfDay),
                                  orderBy("createdAt", "desc"))
    
        fetchInRealtimeAndRenderPostsFromDB(q, user)
    }

    function fetchAllPosts(user: UserType) {

        const postsRef = collection(db, collectionName)

        const q = query(postsRef, where("uid", "==", user.uid),
                                  orderBy("createdAt", "desc"))
    
        fetchInRealtimeAndRenderPostsFromDB(q as Query, user)
    }

    /* = Functions - UI Functions - Mood = */

    function selectMood(event: MouseEvent | EventTypes): void {

        const selectedMoodEmojiElementId = (event.currentTarget as HTMLButtonElement).id;

        changeMoodsStyleAfterSelection(selectedMoodEmojiElementId, moodEmojiArray);

        const chosenMoodValue = returnMoodValueFromElementId(selectedMoodEmojiElementId);

        moodState = chosenMoodValue;
    }



    function changeMoodsStyleAfterSelection(selectedMoodElementId: string, _allMoodElements?: HTMLButtonElement[]) {

        const moodEmojiArray = Array.from(moodEmojiEls!);

        for (let moodEmojiEl of moodEmojiArray) {
            if (selectedMoodElementId === moodEmojiEl.id) {
                moodEmojiEl.classList.remove("unselected-emoji");
                moodEmojiEl.classList.add("selected-emoji");
            } else {
                moodEmojiEl.classList.remove("selected-emoji");
                moodEmojiEl.classList.add("unselected-emoji");
            }
        }
    }

    function resetAllMoodElements(allMoodElements: HTMLCollectionOf<HTMLButtonElement>) {
        for (let moodEmojiEl of Array.from(allMoodElements)) {
            moodEmojiEl.classList.remove("selected-emoji")
            moodEmojiEl.classList.remove("unselected-emoji")
        }

        moodState = 0
    }

    function returnMoodValueFromElementId(elementId: string) {
        return Number(elementId.slice(5))
    }


    function authUpdateProfile() {
        const newDisplayName = displayNameInputEl?.value
        const newPhotoURL = photoURLInputEl?.value

        updateProfile(auth.currentUser!, {
            displayName: newDisplayName,
            photoURL: newPhotoURL
        }).then(() => {
            console.log("Profile updated")
        }).catch((error: ErrorType) => {
            console.error(error.message)
        })
    }

/* == Functions - UI Functions - Date Filters == */

function resetAllFilterButtons(allFilterButtons: HTMLButtonElement[]) {
    for (let filterButtonEl of allFilterButtons) {
        filterButtonEl.classList.remove("selected-filter")
    }
}

function updateFilterButtonStyle(element: HTMLButtonElement): void {
    element.classList.add("selected-filter")
}

function fetchPostsFromPeriod(period: string, user: UserType) {
    if (period === "today") {
        fetchTodayPosts(user)
    } else if (period === "week") {
        fetchWeekPosts(user)
    } else if (period === "month") {
        fetchMonthPosts(user)
    } else {
        fetchAllPosts(user)
    }
}

function selectFilter(event: MouseEvent): void {
    const user = auth.currentUser;

    const selectedFilterElement = event.target as HTMLButtonElement | null;

    const selectedFilterElementId = selectedFilterElement?.id;
    const selectedFilterPeriod = selectedFilterElementId?.split("-")[0];

    resetAllFilterButtons(filterAllButtons);

    updateFilterButtonStyle(selectedFilterElement!);

    fetchPostsFromPeriod(selectedFilterPeriod!, user as UserType)
}

}