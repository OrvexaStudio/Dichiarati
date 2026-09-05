const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   STATO APP
========================================================= */

let selectedGender = "";
let currentStep = 1;
let texts = [];

let declarationData = null;
let currentDeclarationPage = 0;
let selectedAnswerMessage = "";


/* =========================================================
   SCHERMATE
========================================================= */

const homeScreen = $("#homeScreen");
const createScreen = $("#createScreen");
const generatedScreen = $("#generatedScreen");
const declarationScreen = $("#declarationScreen");
const questionScreen = $("#questionScreen");
const resultScreen = $("#resultScreen");

const formSteps = $$(".form-step");
const textsContainer = $("#textsContainer");


/* =========================================================
   CAMBIO SCHERMATA
========================================================= */

function showScreen(screen) {

    document.querySelectorAll(".screen").forEach((element) => {
        element.classList.remove("active");
    });

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   HOME
========================================================= */

if ($("#startButton")) {

    $("#startButton").addEventListener("click", () => {

        resetCreator();

        showScreen(createScreen);

        updateStep();

    });

}


/* =========================================================
   SELEZIONE RAGAZZO / RAGAZZA
========================================================= */

$$(".gender-button").forEach((button) => {

    button.addEventListener("click", () => {

        $$(".gender-button").forEach((btn) => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedGender =
            button.dataset.gender || "";

    });

});


/* =========================================================
   STEP CREAZIONE
========================================================= */

function updateStep() {

    formSteps.forEach((step) => {

        step.classList.toggle(
            "active",
            Number(step.dataset.step) === currentStep
        );

    });


    if ($("#stepCounter")) {

        $("#stepCounter").textContent =
            `${currentStep} / 3`;

    }


    const labels = [
        "Informazioni",
        "Le tue parole",
        "La risposta"
    ];


    if ($("#stepLabel")) {

        $("#stepLabel").textContent =
            labels[currentStep - 1];

    }


    if ($("#progressBar")) {

        $("#progressBar").style.width =
            `${(currentStep / 3) * 100}%`;

    }

}


/* =========================================================
   STEP 1 → STEP 2
========================================================= */

const nextButton = $(".next-button");

if (nextButton) {

    nextButton.addEventListener("click", () => {

        const creatorName =
            $("#creatorName")?.value.trim() || "";

        const targetName =
            $("#targetName")?.value.trim() || "";

        const phone =
            normalizePhone(
                $("#phoneNumber")?.value || ""
            );


        if (!selectedGender) {

            alert(
                "Seleziona se sei un ragazzo o una ragazza."
            );

            return;
        }


        if (!creatorName) {

            alert(
                "Inserisci il tuo nome."
            );

            return;
        }


        if (!targetName) {

            alert(
                "Inserisci il nome della persona."
            );

            return;
        }


        if (!phone) {

            alert(
                "Inserisci un numero WhatsApp valido."
            );

            return;
        }


        currentStep = 2;

        updateStep();


        if (texts.length === 0) {
            addText();
        }

    });

}


/* =========================================================
   AGGIUNTA TESTO
========================================================= */

function addText(initialValue = "") {

    if (texts.length >= 10) {

        alert(
            "Puoi inserire massimo 10 schermate."
        );

        return;
    }


    const index =
        texts.length;


    texts.push(initialValue);


    const card =
        document.createElement("div");


    card.className =
        "text-card";


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
                ? `
                    <button
                        type="button"
                        class="remove-text"
                        data-index="${index}"
                    >
                        ×
                    </button>
                `
                : ""
        }
    `;


    if (textsContainer) {
        textsContainer.appendChild(card);
    }


    const textarea =
        card.querySelector(".declaration-input");


    if (textarea) {

        textarea.value =
            initialValue;


        textarea.addEventListener("input", () => {

            texts[index] =
                textarea.value;

        });

    }


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


/* =========================================================
   RIDISEGNA TESTI
========================================================= */

function renderTexts() {

    const savedTexts =
        [...texts];


    if (textsContainer) {
        textsContainer.innerHTML = "";
    }


    texts = [];


    savedTexts.forEach((text) => {

        addText(text);

    });


    updateAddButton();

}


/* =========================================================
   PULSANTE AGGIUNGI
========================================================= */

function updateAddButton() {

    const button =
        $("#addTextButton");


    if (!button) {
        return;
    }


    if (texts.length >= 10) {

        button.disabled = true;

        button.textContent =
            "Massimo 10 schermate";

    } else {

        button.disabled = false;

        button.textContent =
            "+ Aggiungi schermata";

    }

}


if ($("#addTextButton")) {

    $("#addTextButton").addEventListener(
        "click",
        () => addText()
    );

}


/* =========================================================
   STEP 2 → STEP 3
========================================================= */

if ($("#goToStep3")) {

    $("#goToStep3").addEventListener("click", () => {

        const validTexts =
            texts
                .map((text) => text.trim())
                .filter(Boolean);


        if (validTexts.length === 0) {

            alert(
                "Scrivi almeno una schermata."
            );

            return;
        }


        texts =
            validTexts;


        currentStep = 3;

        updateStep();

        setDefaultMessages();

    });

}


/* =========================================================
   TORNA A STEP 1
========================================================= */

if ($("#backToStep1")) {

    $("#backToStep1").addEventListener("click", () => {

        currentStep = 1;

        updateStep();

    });

}


/* =========================================================
   TORNA A STEP 2
========================================================= */

if ($("#backToStep2")) {

    $("#backToStep2").addEventListener("click", () => {

        currentStep = 2;

        updateStep();

    });

}


/* =========================================================
   MESSAGGI PREDEFINITI
========================================================= */

function setDefaultMessages() {

    if (
        $("#yesMessage") &&
        !$("#yesMessage").value.trim()
    ) {

        $("#yesMessage").value =
            "Ciao! Ho visto la tua dichiarazione e la mia risposta è sì.";

    }


    if (
        $("#noMessage") &&
        !$("#noMessage").value.trim()
    ) {

        $("#noMessage").value =
            "Ciao! Ho visto la tua dichiarazione. Ti ringrazio per quello che mi hai scritto, ma la mia risposta è no.";

    }

}


/* =========================================================
   PRESET MESSAGGI
========================================================= */

$$(".preset-button").forEach((button) => {

    button.addEventListener("click", () => {

        const target =
            document.getElementById(
                button.dataset.target
            );


        if (!target) {
            return;
        }


        target.value =
            button.dataset.text || "";


        target.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

    });

});


/* =========================================================
   GENERAZIONE DICHIARAZIONE
========================================================= */

if ($("#generateButton")) {

    $("#generateButton").addEventListener(
        "click",
        () => {

            const creatorName =
                $("#creatorName")?.value.trim() || "";


            const targetName =
                $("#targetName")?.value.trim() || "";


            const phone =
                normalizePhone(
                    $("#phoneNumber")?.value || ""
                );


            const yesMessage =
                $("#yesMessage")?.value.trim() || "";


            const noMessage =
                $("#noMessage")?.value.trim() || "";


            const cleanTexts =
                texts
                    .map((text) => text.trim())
                    .filter(Boolean);


            if (!creatorName) {

                alert(
                    "Inserisci il tuo nome."
                );

                return;
            }


            if (!targetName) {

                alert(
                    "Inserisci il nome della persona."
                );

                return;
            }


            if (!phone) {

                alert(
                    "Inserisci un numero WhatsApp valido."
                );

                return;
            }


            if (cleanTexts.length === 0) {

                alert(
                    "Devi inserire almeno una schermata."
                );

                return;
            }


            if (!yesMessage) {

                alert(
                    "Inserisci il messaggio per la risposta SÌ."
                );

                return;
            }


            if (!noMessage) {

                alert(
                    "Inserisci il messaggio per la risposta NO."
                );

                return;
            }


            /*
             * IMPORTANTE
             *
             * senderName =
             * persona che crea la dichiarazione
             *
             * recipientName =
             * persona che riceve la dichiarazione
             */

            declarationData = {

                id:
                    generateUniqueId(),

                gender:
                    selectedGender,

                senderName:
                    creatorName,

                recipientName:
                    targetName,

                phone:
                    phone,

                texts:
                    cleanTexts,

                yesMessage:
                    yesMessage,

                noMessage:
                    noMessage,

                createdAt:
                    Date.now()

            };


            /*
             * Codifichiamo tutti i dati
             * direttamente nel link.
             */

            const encoded =
                encodeData(
                    declarationData
                );


            /*
             * Prendiamo solamente l'indirizzo
             * della pagina attuale.
             *
             * Funziona anche su:
             *
             * /Dichiarati/
             *
             * /Dichiarati/index.html
             */

            const baseUrl =
                window.location.href
                    .split("?")[0]
                    .split("#")[0];


            const url =
                `${baseUrl}?d=${encoded}`;


            if ($("#generatedLink")) {

                $("#generatedLink").value =
                    url;

            }


            showScreen(
                generatedScreen
            );

        }
    );

}


/* =========================================================
   GENERAZIONE ID UNICO
========================================================= */

function generateUniqueId() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";


    let id = "";


    for (let i = 0; i < 10; i++) {

        id +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }


    return id;

}


/* =========================================================
   CODIFICA DATI
========================================================= */

function encodeData(data) {

    try {

        const json =
            JSON.stringify(data);


        const bytes =
            new TextEncoder().encode(json);


        let binary = "";


        const chunkSize = 0x8000;


        for (
            let i = 0;
            i < bytes.length;
            i += chunkSize
        ) {

            const chunk =
                bytes.subarray(
                    i,
                    Math.min(
                        i + chunkSize,
                        bytes.length
                    )
                );


            binary +=
                String.fromCharCode(
                    ...chunk
                );

        }


        return btoa(binary)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

    } catch (error) {

        console.error(
            "Errore nella codifica:",
            error
        );

        return "";

    }

}


/* =========================================================
   DECODIFICA DATI
========================================================= */

function decodeData(encoded) {

    try {

        if (!encoded) {
            return null;
        }


        let base64 =
            encoded
                .replace(/-/g, "+")
                .replace(/_/g, "/");


        while (
            base64.length % 4 !== 0
        ) {

            base64 += "=";

        }


        const binary =
            atob(base64);


        const bytes =
            new Uint8Array(
                binary.length
            );


        for (
            let i = 0;
            i < binary.length;
            i++
        ) {

            bytes[i] =
                binary.charCodeAt(i);

        }


        const json =
            new TextDecoder().decode(
                bytes
            );


        return JSON.parse(json);

    } catch (error) {

        console.error(
            "Errore nella decodifica del link:",
            error
        );

        return null;

    }

}


/* =========================================================
   COPIA LINK
========================================================= */

if ($("#copyLinkButton")) {

    $("#copyLinkButton").addEventListener(
        "click",
        async () => {

            const input =
                $("#generatedLink");


            if (!input || !input.value) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    input.value
                );


                $("#copyLinkButton").textContent =
                    "Copiato";


                setTimeout(() => {

                    $("#copyLinkButton").textContent =
                        "Copia";

                }, 2000);


            } catch (error) {

                input.select();

                document.execCommand(
                    "copy"
                );

            }

        }
    );

}


/* =========================================================
   CONDIVIDI LINK SU WHATSAPP
========================================================= */

if ($("#shareButton")) {

    $("#shareButton").addEventListener(
        "click",
        () => {

            const url =
                $("#generatedLink")?.value || "";


            if (!url) {
                return;
            }


            const message =
                `Ho qualcosa da dirti...\n\n${url}`;


            const whatsappUrl =
                `https://wa.me/?text=${encodeURIComponent(
                    message
                )}`;


            window.open(
                whatsappUrl,
                "_blank"
            );

        }
    );

}


/* =========================================================
   NUOVA DICHIARAZIONE
========================================================= */

if ($("#newDeclarationButton")) {

    $("#newDeclarationButton").addEventListener(
        "click",
        () => {

            resetCreator();


            showScreen(
                createScreen
            );


            updateStep();

        }
    );

}


/* =========================================================
   RESET CREAZIONE
========================================================= */

function resetCreator() {

    selectedGender = "";

    currentStep = 1;

    texts = [];

    declarationData = null;

    currentDeclarationPage = 0;

    selectedAnswerMessage = "";


    if ($("#creatorName")) {

        $("#creatorName").value =
            "";

    }


    if ($("#targetName")) {

        $("#targetName").value =
            "";

    }


    if ($("#phoneNumber")) {

        $("#phoneNumber").value =
            "";

    }


    if ($("#yesMessage")) {

        $("#yesMessage").value =
            "";

    }


    if ($("#noMessage")) {

        $("#noMessage").value =
            "";

    }


    $$(".gender-button").forEach(
        (button) => {

            button.classList.remove(
                "selected"
            );

        }
    );


    if (textsContainer) {

        textsContainer.innerHTML =
            "";

    }


    updateAddButton();

}


/* =========================================================
   CARICA DICHIARAZIONE DAL LINK
========================================================= */

function loadDeclarationFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const encoded =
        params.get("d");


    /*
     * Se non c'è ?d=...
     * siamo semplicemente nella home.
     */

    if (!encoded) {
        return;
    }


    const data =
        decodeData(encoded);


    if (!data) {

        showInvalidDeclaration();

        return;

    }


    /*
     * COMPATIBILITÀ CON I VECCHI LINK
     *
     * Vecchio sistema:
     * creatorName
     * targetName
     *
     * Nuovo sistema:
     * senderName
     * recipientName
     */

    const senderName =
        data.senderName ||
        data.creatorName ||
        "";


    const recipientName =
        data.recipientName ||
        data.targetName ||
        "";


    /*
     * Controlliamo che il link
     * contenga tutti i dati necessari.
     */

    if (
        !Array.isArray(data.texts) ||
        data.texts.length === 0 ||
        !senderName ||
        !recipientName ||
        !data.phone
    ) {

        showInvalidDeclaration();

        return;

    }


    /*
     * Normalizziamo i dati.
     */

    data.senderName =
        senderName;


    data.recipientName =
        recipientName;


    data.phone =
        normalizePhone(
            data.phone
        );


    if (!data.phone) {

        showInvalidDeclaration();

        return;

    }


    /*
     * Da qui in poi l'app utilizza
     * esclusivamente questi nomi.
     */

    declarationData =
        data;


    currentDeclarationPage =
        0;


    showDeclarationPage();


    showScreen(
        declarationScreen
    );

}


/* =========================================================
   MOSTRA PAGINA DELLA DICHIARAZIONE
========================================================= */

function showDeclarationPage() {

    if (
        !declarationData ||
        !Array.isArray(
            declarationData.texts
        )
    ) {

        return;

    }


    const text =
        declarationData.texts[
            currentDeclarationPage
        ];


    /*
     * QUI DEVE COMPARIRE IL DESTINATARIO.
     *
     * Esempio:
     *
     * Per Maria
     *
     * NON:
     *
     * Per Francesco
     */

    if ($("#declarationRecipient")) {

        $("#declarationRecipient").textContent =
            `Per ${declarationData.recipientName}`;

    }


    if ($("#declarationText")) {

        $("#declarationText").style.animation =
            "none";


        void $("#declarationText").offsetWidth;


        $("#declarationText").style.animation =
            "declarationIn 0.7s ease";


        $("#declarationText").textContent =
            text;

    }


    if ($("#declarationProgress")) {

        $("#declarationProgress").textContent =
            `${currentDeclarationPage + 1} / ${declarationData.texts.length}`;

    }


    if ($("#continueButton")) {

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

}


/* =========================================================
   CONTINUA DICHIARAZIONE
========================================================= */

if ($("#continueButton")) {

    $("#continueButton").addEventListener(
        "click",
        () => {

            if (!declarationData) {
                return;
            }


            if (
                currentDeclarationPage <
                declarationData.texts.length - 1
            ) {

                currentDeclarationPage++;


                showDeclarationPage();

            } else {

                showFinalQuestion();

            }

        }
    );

}


/* =========================================================
   DOMANDA FINALE
========================================================= */

function showFinalQuestion() {

    if (!declarationData) {
        return;
    }


    /*
     * La domanda è rivolta ESCLUSIVAMENTE
     * al destinatario.
     *
     * Esempio:
     *
     * Maria, vuoi stare con me?
     */

    if ($("#questionTitle")) {

        $("#questionTitle").textContent =
            `${declarationData.recipientName}, vuoi stare con me?`;

    }


    showScreen(
        questionScreen
    );

}


/* =========================================================
   RISPOSTA SÌ
========================================================= */

if ($("#yesButton")) {

    $("#yesButton").addEventListener(
        "click",
        () => {

            /*
             * È il destinatario a scegliere.
             */

            showResult(true);

        }
    );

}


/* =========================================================
   RISPOSTA NO
========================================================= */

if ($("#noButton")) {

    $("#noButton").addEventListener(
        "click",
        () => {

            /*
             * È il destinatario a scegliere.
             */

            showResult(false);

        }
    );

}


/* =========================================================
   MOSTRA RISULTATO
========================================================= */

function showResult(isYes) {

    if (!declarationData) {
        return;
    }


    if (isYes) {

        if ($("#resultEyebrow")) {

            $("#resultEyebrow").textContent =
                "SÌ";

        }


        if ($("#resultTitle")) {

            $("#resultTitle").textContent =
                "Hai detto sì.";

        }


        selectedAnswerMessage =
            declarationData.yesMessage;


    } else {

        if ($("#resultEyebrow")) {

            $("#resultEyebrow").textContent =
                "NO";

        }


        if ($("#resultTitle")) {

            $("#resultTitle").textContent =
                "Hai risposto sinceramente.";

        }


        selectedAnswerMessage =
            declarationData.noMessage;

    }


    if ($("#resultMessage")) {

        $("#resultMessage").textContent =
            selectedAnswerMessage;

    }


    showScreen(
        resultScreen
    );

}


/* =========================================================
   WHATSAPP RISPOSTA
========================================================= */

if ($("#whatsappButton")) {

    $("#whatsappButton").addEventListener(
        "click",
        () => {

            if (
                !declarationData ||
                !declarationData.phone
            ) {

                return;

            }


            const phone =
                declarationData.phone
                    .replace(/\D/g, "");


            if (!phone) {

                alert(
                    "Numero WhatsApp non valido."
                );

                return;

            }


            /*
             * Questo è il messaggio scelto
             * dal destinatario.
             */

            const message =
                selectedAnswerMessage;


            const whatsappUrl =
                `https://wa.me/${phone}?text=${encodeURIComponent(
                    message
                )}`;


            window.location.href =
                whatsappUrl;

        }
    );

}


/* =========================================================
   NORMALIZZA NUMERO TELEFONO
========================================================= */

function normalizePhone(phone) {

    if (!phone) {
        return "";
    }


    let clean =
        phone.replace(
            /\D/g,
            ""
        );


    /*
     * 0039...
     * diventa
     * 39...
     */

    if (
        clean.startsWith("00")
    ) {

        clean =
            clean.substring(2);

    }


    /*
     * Se è già un numero italiano
     * con prefisso 39.
     */

    if (
        clean.startsWith("39")
    ) {

        if (
            clean.length >= 11
        ) {

            return `+${clean}`;

        }

    }


    /*
     * Numero italiano senza prefisso.
     */

    if (
        clean.length >= 9
    ) {

        return `+39${clean}`;

    }


    return "";

}


/* =========================================================
   LINK NON VALIDO
========================================================= */

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
                font-family:
                    -apple-system,
                    BlinkMacSystemFont,
                    'Helvetica Neue',
                    Arial,
                    sans-serif;
                background:#0b0b0d;
                color:white;
            "
        >

            <div
                style="
                    max-width:500px;
                "
            >

                <p
                    style="
                        color:#9b9ba3;
                        letter-spacing:3px;
                        font-size:11px;
                        margin-bottom:25px;
                    "
                >
                    DICHIARATI
                </p>

                <h1
                    style="
                        font-size:42px;
                        line-height:1;
                        letter-spacing:-2px;
                        margin-bottom:20px;
                    "
                >
                    Questa dichiarazione
                    non esiste.
                </h1>

                <p
                    style="
                        color:#9b9ba3;
                        line-height:1.6;
                    "
                >
                    Il link potrebbe essere
                    incompleto, modificato
                    oppure non valido.
                </p>

            </div>

        </main>
    `;

}


/* =========================================================
   AVVIO
========================================================= */

loadDeclarationFromUrl();
