const titleTemplates = {
    howto: [
        "How to {topic} in {year}: A Step-by-Step Guide",
        "How to Master {topic}: Tips from the Experts",
        "How to {topic} Like a Pro: Essential Techniques",
        "Beginner's Guide: How to {topic} Successfully",
        "How to {topic}: The Complete Tutorial",
        "How to Get Started with {topic} Today",
        "How to {topic} for Maximum Results",
        "How to {topic} Without the Stress",
        "How to {topic}: Everything You Need to Know",
        "How to {topic} in 30 Days"
    ],
    listicle: [
        "{count} Ways to {topic} That Actually Work",
        "Top {count} {topic} Strategies for {year}",
        "{count} Proven Methods to {topic}",
        "The {count} Best {topic} Hacks You Need to Try",
        "{count} Essential Tips for {topic}",
        "Why {count} {topic} Techniques Are Changing the Game",
        "{count} Simple Steps to Master {topic}",
        "Discover {count} Hidden {topic} Secrets",
        "{count} {topic} Ideas That Will Blow Your Mind",
        "The Ultimate {count}-Point {topic} Checklist"
    ],
    question: [
        "What Is the Best Way to {topic}?",
        "Why Should You {topic} in {year}?",
        "Are You Making These {topic} Mistakes?",
        "Is {topic} Still Relevant in {year}?",
        "What Are the Benefits of {topic}?",
        "Can {topic} Really Transform Your Life?",
        "What Do Experts Say About {topic}?",
        "Is {topic} Worth the Investment?",
        "Why Is {topic} So Popular Right Now?",
        "What Makes a Great {topic} Strategy?"
    ],
    comparison: [
        "{topic}: Pros and Cons You Should Know",
        "The Great Debate: {topic} vs Traditional Methods",
        "Which {topic} Approach Is Right for You?",
        "Comparing the Best {topic} Options in {year}",
        "{topic}: Is It Better Than the Alternatives?",
        "The Honest Truth About {topic}",
        "{topic} vs the Competition: Who Wins?",
        "Is {topic} Overrated or Underrated?",
        "Breaking Down {topic}: What Works and What Doesn't",
        "{topic}: The Good, the Bad, and the Ugly"
    ],
    ultimate: [
        "The Ultimate Guide to {topic} in {year}",
        "Mastering {topic}: The Definitive Guide",
        "The Complete {topic} Playbook for Beginners",
        "Everything You Need to Know About {topic}",
        "The All-In-One {topic} Resource Guide",
        "{topic} 101: The Foundation You Need",
        "Your Go-To {topic} Handbook for Success",
        "The Comprehensive {topic} Survival Guide",
        "{topic} Demystified: An Expert's Guide",
        "The Gold Standard Guide to {topic}"
    ]
};

const categoryMapping = {
    howto: "education",
    listicle: "lifestyle",
    question: "business",
    comparison: "technology",
    ultimate: "education"
};

let currentCategory = "all";
let generatedTitles = [];
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

const topicInput = document.getElementById("topic-input");
const generateBtn = document.getElementById("generate-btn");
const resultsSection = document.getElementById("results-section");
const titlesList = document.getElementById("titles-list");
const favoritesSection = document.getElementById("favorites-section");
const favoritesList = document.getElementById("favorites-list");
const emptyFavorites = document.getElementById("empty-favorites");
const favoritesCount = document.getElementById("favorites-count");
const copyAllBtn = document.getElementById("copy-all-btn");
const showFavoritesBtn = document.getElementById("show-favorites-btn");
const backBtn = document.getElementById("back-btn");
const filterTags = document.getElementById("filter-tags");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTopic(topic) {
    return topic
        .trim()
        .replace(/\s+/g, " ")
        .replace(/^(.{40}).*$/, "$1");
}

function generateTitles(topic) {
    const formattedTopic = formatTopic(topic);
    const count = Math.floor(Math.random() * 6) + 7;
    const year = new Date().getFullYear();
    const titles = [];
    const allTypes = Object.keys(titleTemplates);

    allTypes.forEach(type => {
        const templates = titleTemplates[type];
        const selectedCount = type === "ultimate" ? 4 : Math.floor(templates.length / allTypes.length) + 1;
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, selectedCount);

        selected.forEach(template => {
            let title = template
                .replace(/\{topic\}/g, formattedTopic)
                .replace(/\{year\}/g, year)
                .replace(/\{count\}/g, count);
            titles.push({
                text: title,
                category: categoryMapping[type],
                type: type
            });
        });
    });

    return titles.sort(() => Math.random() - 0.5);
}

function isFavorited(titleText) {
    return favorites.some(f => f.text === titleText);
}

function toggleFavorite(title) {
    const index = favorites.findIndex(f => f.text === title.text);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast("Removed from favorites");
    } else {
        favorites.push(title);
        showToast("Added to favorites!");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesCount();
    renderTitles(generatedTitles);
    if (favoritesSection.style.display !== "none") {
        renderFavorites();
    }
}

function updateFavoritesCount() {
    favoritesCount.textContent = favorites.length;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Copied to clipboard!");
    }).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("Copied to clipboard!");
    });
}

function shareTitle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: title,
            url: window.location.href
        });
    } else {
        copyToClipboard(title);
        showToast("Title copied! Share it on social media.");
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function createTitleCard(title) {
    const card = document.createElement("div");
    card.className = "title-card";
    card.style.animationDelay = `${Math.random() * 0.2}s`;

    const favorited = isFavorited(title.text);

    card.innerHTML = `
        <span class="title-text">${title.text}</span>
        <span class="title-category">${capitalizeFirst(title.category)}</span>
        <div class="title-actions">
            <button class="copy-btn" title="Copy to clipboard" data-title="${title.text.replace(/"/g, '&quot;')}">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </button>
            <button class="favorite-btn ${favorited ? 'favorited' : ''}" title="Save to favorites">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <button class="share-btn" title="Share this title">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
            </button>
        </div>
    `;

    card.querySelector(".copy-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        copyToClipboard(title.text);
    });

    card.querySelector(".favorite-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(title);
    });

    card.querySelector(".share-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        shareTitle(title.text);
    });

    return card;
}

function renderTitles(titles) {
    const filteredTitles = currentCategory === "all"
        ? titles
        : titles.filter(t => t.category === currentCategory);

    titlesList.innerHTML = "";
    filteredTitles.forEach(title => {
        titlesList.appendChild(createTitleCard(title));
    });

    if (filteredTitles.length === 0) {
        titlesList.innerHTML = '<div class="empty-state"><p>No titles found for this category. Try a different filter.</p></div>';
    }
}

function renderFavorites() {
    favoritesList.innerHTML = "";
    if (favorites.length === 0) {
        emptyFavorites.style.display = "block";
        return;
    }
    emptyFavorites.style.display = "none";
    favorites.forEach(title => {
        favoritesList.appendChild(createTitleCard(title));
    });
}

// Event Listeners
generateBtn.addEventListener("click", () => {
    const topic = topicInput.value.trim();
    if (!topic) {
        topicInput.focus();
        topicInput.style.borderColor = "#ef4444";
        setTimeout(() => {
            topicInput.style.borderColor = "";
        }, 2000);
        return;
    }
    generatedTitles = generateTitles(topic);
    resultsSection.style.display = "block";
    favoritesSection.style.display = "none";
    renderTitles(generatedTitles);
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

topicInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generateBtn.click();
    }
});

filterTags.addEventListener("click", (e) => {
    const tag = e.target.closest(".filter-tag");
    if (!tag) return;

    document.querySelectorAll(".filter-tag").forEach(t => t.classList.remove("active"));
    tag.classList.add("active");
    currentCategory = tag.dataset.category;
    renderTitles(generatedTitles);
});

copyAllBtn.addEventListener("click", () => {
    if (generatedTitles.length === 0) return;
    const allText = generatedTitles.map(t => t.text).join("\n");
    copyToClipboard(allText);
    showToast("All titles copied!");
});

showFavoritesBtn.addEventListener("click", () => {
    favoritesSection.style.display = "block";
    resultsSection.style.display = "none";
    renderFavorites();
});

backBtn.addEventListener("click", () => {
    favoritesSection.style.display = "none";
    resultsSection.style.display = "block";
});

// Initialize
updateFavoritesCount();
