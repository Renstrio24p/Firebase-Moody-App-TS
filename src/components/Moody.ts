import { Emoji1, Emoji2, Emoji3, Emoji4, Emoji5, GoogleImg, TSImg, signOutImg } from './Images'
import '../assets/css/app.css'
import { useMoody } from './func/Moody.func'


export default function Moody(DOM: HTMLDivElement){

    DOM.innerHTML = (`
        <section id="logged-out-view">
            <div class="container">

                <div class='top-logo'>
                    <h1 class="app-title">Moody</h1>
                    <div class='logo'>
                        <img src=${TSImg.image} alt=${TSImg.alt} />
                    </div>
                </div>
        
                <div class="provider-buttons">
                    <button id="sign-in-with-google-btn" class="provider-btn">
                        <img src=${GoogleImg.image} alt=${GoogleImg.alt} class="google-btn-logo">
                        Sign in with Google
                    </button>
                </div>
        
                <div class="auth-fields-and-buttons">
                    <input id="email-input" type="email" placeholder="Email">
                    <input id="password-input" type="password" placeholder="Password">

                    <button id="sign-in-btn" class="primary-btn">Sign in</button>
                    <button id="create-account-btn" class="secondary-btn">Create Account</button>
                </div>
            </div>
        </section>

        <section id="logged-in-view">
            <div class="container">
                <nav>
                    <button id="sign-out-btn" class="icon-btn">
                        <img src=${signOutImg.image} alt=${signOutImg.alt} class="icon-img-btn">
                    </button>
                </nav>
                <div class="app-container">
                    <div class="user-section">
                        <img id="user-profile-picture">
                        <h2 id="user-greeting"></h2>
                    </div>

                    <div class="mood-emojis">
                    <button id="mood-1" class="mood-emoji-btn">
                        <img src=${Emoji1.image} alt=${Emoji1.alt}>
                        Awful
                    </button>
                    <button id="mood-2" class="mood-emoji-btn">
                        <img src=${Emoji2.image} alt=${Emoji2.alt}>
                        Bad
                    </button>
                    <button id="mood-3" class="mood-emoji-btn">
                        <img src=${Emoji3.image} alt=${Emoji3.alt}>
                        Meh
                    </button>
                    <button id="mood-4" class="mood-emoji-btn">
                        <img src=${Emoji4.image} alt=${Emoji4.alt}>
                        Good
                    </button>
                    <button id="mood-5" class="mood-emoji-btn">
                        <img src=${Emoji5.image} alt=${Emoji5.alt}>
                        Amazing
                    </button>
                </div>

                    <div class="post-section">
                        <textarea id="post-input" placeholder="Write down how you're feeling..."></textarea>
                        <button id="post-btn" class="primary-btn">Post</button>
                    </div>

                    <div class="filters-and-posts-section">
                        <div class="filters-section">
                            <button id="today-filter-btn" class="filter-btn">Today</button>
                            <button id="week-filter-btn" class="filter-btn">Week</button>
                            <button id="month-filter-btn" class="filter-btn">Month</button>
                            <button id="all-filter-btn" class="filter-btn">All</button>
                        </div>
                        
                        <div id="posts" class="posts-section">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `)

    useMoody();

}