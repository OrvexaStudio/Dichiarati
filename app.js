const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================
   STATO
========================= */

let selectedGender = "";
let currentStep = 1;
let texts = [];

let declarationData = null;

let currentDeclarationPage = 0;


/* =========================
   ELEMENTI
========================= */

const homeScreen = $("#homeScreen");
const createScreen = $("#createScreen");
const generatedScreen = $("#generatedScreen");
const declarationScreen = $("#declarationScreen");
const questionScreen = $("#questionScreen");
const resultScreen = $("#resultScreen");

const formSteps = $$(".form-step");

const textsContainer = $("#textsContainer");


/* =========================
   SCREEN
========================= */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach((element) => {
        element.classList.remove("active");
    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   HOME
========================= */

$("#startButton").addEventListener("click", () => {

    resetCreator();

    showScreen(createScreen);

    updateStep();

});


/* =========================
   GENERE
========================= */

$$(".gender-button").forEach((button) => {

    button.addEventListener("click", () => {

        $$(".gender-button").forEach((btn) => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedGender = button.dataset.gender;

    });

});


/* =========================
   STEP
========================= */

function updateStep() {

    formSteps.forEach((step) => {

        step.classList.toggle(
            "active",
            Number(step.dataset.step) === currentStep
        );

    });

    $("#stepCounter").textContent = `${currentStep} / 3`;

    const labels = [
        "Informazioni",
        "Le tue parole",
        "La risposta"
    ];

    $("#stepLabel").textContent = labels[currentStep - 1];

    $("#progressBar").style.width =
        `${(currentStep / 3) * 100}%`;

}


/* =========================
   STEP 1 → 2
========================= */

$(".next-button").addEventListener("click", () => {

    const creatorName =
        $("#creatorName").value.trim();

    const targetName =
        $("#targetName").value.trim();

    const phone =
        normalizePhone($("#phoneNumber").value);

    if (!selectedGender) {
        alert("Seleziona se sei un ragazzo o una ragazza.");
        return;
    }

    if (!creatorName) {
        alert("Inserisci il tuo nome.");
        return;
    }

    if (!targetName) {
        alert("Inserisci il nome della persona.");
        return;
    }

    if (!phone) {
        alert("Inserisci il tuo numero WhatsApp.");
        return;
    }

    currentStep = 2;

    updateStep();

    if (texts.length === 0) {
        addText();
    }

});


/* =========================
   TESTI
========================= */

function addText() {

    if (texts.length >= 10) {
        alert("Puoi inserire massimo 10 schermate.");
        return;
    }

    const index = texts.length;

    texts.push("");

    const card = document.createElement("div");

    card.className = "text-card";

    card.innerHTML = `
        <div class="text-card-number">
            SCHERMATA ${index + 1}
        </div>

        <textarea
            class="declaration-input"
            data-index="${index}"
            placeholder="Scrivi quello che vuoi dire..."
            maxlength="500"
        ></textarea>

        ${
            index > 0
                ? `<button
                    class="remove-text"
                    data-index="${index}"
                >
                    ×
                </button>`
                : ""
        }
    `;

    textsContainer.appendChild(card);

    const textarea =
        card.querySelector(".declaration-input");

    textarea.addEventListener("input", () => {

        texts[index] = textarea.value;

    });

    const removeButton =
        card.querySelector(".remove-text");

    if (removeButton) {

        removeButton.addEventListener("click", () => {

            texts.splice(index, 1);

            renderTexts();

        });

    }

    updateAddButton();

}


function renderTexts() {

    textsContainer.innerHTML = "";

    const oldTexts = [...texts];

    texts = [];

    oldTexts.forEach((text) => {

        addText();

        texts[texts.length - 1] = text;

    });

    const textareas =
        $$(".declaration-input");

    textareas.forEach((textarea, index) => {
        textarea.value = texts[index] || "";
    });

}


function updateAddButton() {

    const button = $("#addTextButton");

    if (texts.length >= 10) {

        button.disabled = true;
        button.textContent = "Massimo 10 schermate";

    } else {

        button.disabled = false;
        button.textContent = "+ Aggiungi schermata";

    }

}


$("#addTextButton").addEventListener("click", addText);


/* =========================
   STEP 2 → 3
========================= */

$("#goToStep3").addEventListener("click", () => {

    const validTexts =
        texts
            .map((text) => text.trim())
            .filter(Boolean);

    if (validTexts.length === 0) {

        alert("Scrivi almeno una schermata.");

        return;
    }

    texts = validTexts;

    currentStep = 3;

    updateStep();

    setDefaultMessages();

});


$("#backToStep1").addEventListener("click", () => {

    currentStep = 1;

    updateStep();

});


$("#backToStep2").addEventListener("click", () => {

    currentStep = 2;

    updateStep();

});


/* =========================
   MESSAGGI
========================= */

function setDefaultMessages() {

    if (!$("#yesMessage").value) {

        $("#yesMessage").value =
            "Ciao! Ho visto la tua dichiarazione e la mia risposta è sì.";

    }

    if (!$("#noMessage").value) {

        $("#noMessage").value =
            "Ciao! Ho visto la tua dichiarazione. Ti ringrazio per quello che mi hai scritto, ma la mia risposta è no.";

    }

}


$$(".preset-button").forEach((button) => {

    button.addEventListener("click", () => {

        const target =
            document.getElementById(
                button.dataset.target
            );

        target.value = button.dataset.text;

    });

});


/* =========================
   GENERAZIONE
========================= */

$("#generateButton").addEventListener("click", () => {

    const creatorName =
        $("#creatorName").value.trim();

    const targetName =
        $("#targetName").value.trim();

    const phone =
        normalizePhone($("#phoneNumber").value);

    const yesMessage =
        $("#yesMessage").value.trim();

    const noMessage =
        $("#noMessage").value.trim();

    if (!yesMessage || !noMessage) {

        alert("Inserisci entrambi i messaggi di risposta.");

        return;
    }


    const cleanTexts =
        texts
            .map((text) => text.trim())
            .filter(Boolean);


    if (cleanTexts.length === 0) {

        alert("Devi inserire almeno una schermata.");

        return;
    }


    declarationData = {

        id: generateUniqueId(),

        gender: selectedGender,

        creatorName,

        targetName,

        phone,

        texts: cleanTexts,

        yesMessage,

        noMessage,

        createdAt: Date.now()

    };


    const encoded =
        encodeData(declarationData);


    const url =
        `${window.location.origin}${window.location.pathname}?d=${encoded}`;


    $("#generatedLink").value = url;

    showScreen(generatedScreen);

});


/* =========================
   ID
========================= */

function generateUniqueId() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let id = "";

    for (let i = 0; i < 8; i++) {

        id += chars[
            Math.floor(Math.random() * chars.length)
        ];

    }

    return id;

}


/* =========================
   CODIFICA
========================= */

function encodeData(data) {

    const json =
        JSON.stringify(data);

    const encoded =
        btoa(
            encodeURIComponent(json)
                .replace(
                    /%([0-9A-F]{2})/g,
                    (_, p1) =>
                        String.fromCharCode(
                            parseInt(p1, 16)
                        )
                )
        );

    return encoded
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

}


function decodeData(encoded) {

    try {

        encoded =
            encoded
                .replace(/-/g, "+")
                .replace(/_/g, "/");

        while (encoded.length % 4) {
            encoded += "=";
        }

        const binary =
            atob(encoded);

        const percentEncoded =
            Array.from(binary)
                .map(
                    (char) =>
                        "%" +
                        char.charCodeAt(0)
                            .toString(16)
                            .padStart(2, "0")
                )
                .join("");

        const json =
            decodeURIComponent(percentEncoded);

        return JSON.parse(json);

    } catch (error) {

        return null;

    }

}


/* =========================
   COPIA LINK
========================= */

$("#copyLinkButton").addEventListener("click", async () => {

    const input = $("#generatedLink");

    try {

        await navigator.clipboard.writeText(input.value);

        $("#copyLinkButton").textContent = "Copiato";

        setTimeout(() => {

            $("#copyLinkButton").textContent = "Copia";

        }, 2000);

    } catch {

        input.select();

        document.execCommand("copy");

    }

});


/* =========================
   WHATSAPP CON LINK
========================= */

$("#shareButton").addEventListener("click", () => {

    const url =
        $("#generatedLink").value;

    const message =
        `Ho qualcosa da dirti...\n\n${url}`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
    );

});


/* =========================
   RESET
========================= */

$("#newDeclarationButton").addEventListener("click", () => {

    resetCreator();

    showScreen(createScreen);

    updateStep();

});


function resetCreator() {

    selectedGender = "";

    currentStep = 1;

    texts = [];

    declarationData = null;

    currentDeclarationPage = 0;

    $("#creatorName").value = "";
    $("#targetName").value = "";
    $("#phoneNumber").value = "";

    $("#yesMessage").value = "";
    $("#noMessage").value = "";

    $$(".gender-button").forEach((button) => {
        button.classList.remove("selected");
    });

    textsContainer.innerHTML = "";

    updateAddButton();

}


/* =========================
   DICHIARAZIONE DA LINK
========================= */

function loadDeclarationFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const encoded =
        params.get("d");

    if (!encoded) {
        return;
    }

    const data =
        decodeData(encoded);

    if (!data || !data.texts) {

        showInvalidDeclaration();

        return;
    }

    declarationData = data;

    currentDeclarationPage = 0;

    showDeclarationPage();

    showScreen(declarationScreen);

}


/* =========================
   PAGINA DICHIARAZIONE
========================= */

function showDeclarationPage() {

    const text =
        declarationData.texts[
            currentDeclarationPage
        ];


    $("#declarationRecipient").textContent =
        `Per ${declarationData.targetName}`;


    $("#declarationText").style.animation = "none";

    void $("#declarationText").offsetWidth;

    $("#declarationText").style.animation =
        "declarationIn 0.7s ease";


    $("#declarationText").textContent =
        text;


    $("#declarationProgress").textContent =
        `${currentDeclarationPage + 1} / ${declarationData.texts.length}`;


    if (
        currentDeclarationPage ===
        declarationData.texts.length - 1
    ) {

        $("#continueButton").textContent =
            "Ho finito";

    } else {

        $("#continueButton").textContent =
            "Continua";

    }

}


/* =========================
   CONTINUA
========================= */

$("#continueButton").addEventListener("click", () => {

    if (
        currentDeclarationPage <
        declarationData.texts.length - 1
    ) {

        currentDeclarationPage++;

        showDeclarationPage();

    } else {

        showFinalQuestion();

    }

});


/* =========================
   DOMANDA
========================= */

function showFinalQuestion() {

    $("#questionTitle").textContent =
        `${declarationData.creatorName}, vuoi stare con me?`;

    showScreen(questionScreen);

}


/* =========================
   RISPOSTA SÌ
========================= */

$("#yesButton").addEventListener("click", () => {

    showResult(
        true
    );

});


/* =========================
   RISPOSTA NO
========================= */

$("#noButton").addEventListener("click", () => {

    showResult(
        false
    );

});


/* =========================
   RISULTATO
========================= */

let selectedAnswerMessage = "";

function showResult(isYes) {

    if (isYes) {

        $("#resultEyebrow").textContent =
            "SÌ";

        $("#resultTitle").textContent =
            "Hai detto sì.";

        selectedAnswerMessage =
            declarationData.yesMessage;

    } else {

        $("#resultEyebrow").textContent =
            "NO";

        $("#resultTitle").textContent =
            "Hai risposto sinceramente.";

        selectedAnswerMessage =
            declarationData.noMessage;

    }

    $("#resultMessage").textContent =
        selectedAnswerMessage;

    showScreen(resultScreen);

}


/* =========================
   WHATSAPP RISPOSTA
========================= */

$("#whatsappButton").addEventListener("click", () => {

    const phone =
        declarationData.phone.replace(
            /\D/g,
            ""
        );

    const message =
        selectedAnswerMessage;

    const whatsappUrl =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.location.href =
        whatsappUrl;

});


/* =========================
   NUMERO
========================= */

function normalizePhone(phone) {

    let clean =
        phone.replace(/\D/g, "");

    if (clean.startsWith("00")) {

        clean =
            clean.substring(2);

    }

    if (clean.startsWith("39")) {

        return "+" + clean;

    }

    if (clean.length >= 9) {

        return "+39" + clean;

    }

    return "";

}


/* =========================
   LINK NON VALIDO
========================= */

function showInvalidDeclaration() {

    document.body.innerHTML = `
        <main
            style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:30px;
                text-align:center;
                font-family:-apple-system,BlinkMacSystemFont,sans-serif;
                background:#0b0b0d;
                color:white;
            "
        >

            <div>

                <p
                    style="
                        color:#9b9ba3;
                        letter-spacing:3px;
                        font-size:11px;
                    "
                >
                    DICHIARATI
                </p>

                <h1>
                    Questa dichiarazione
                    non esiste più.
                </h1>

                <p
                    style="
                        color:#9b9ba3;
                        line-height:1.6;
                    "
                >
                    Il link potrebbe essere
                    incompleto o non valido.
                </p>

            </div>

        </main>
    `;

}


/* =========================
   AVVIO
========================= */

loadDeclarationFromUrl();
