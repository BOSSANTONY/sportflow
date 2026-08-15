/* =========================================================
   SPORTFLOW
   APPLICATION JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {

    timer: {
        seconds: 0,
        running: false,
        interval: null
    },

    rest: {
        seconds: 90,
        running: false,
        interval: null
    },

    calendar: {
        date: new Date()
    },

    program: null,

    measurements: JSON.parse(
        localStorage.getItem("sportflow_measurements")
    ) || [
        { date: "2026-03-01", weight: 74.4 },
        { date: "2026-04-01", weight: 74.0 },
        { date: "2026-05-01", weight: 73.6 },
        { date: "2026-06-01", weight: 73.2 },
        { date: "2026-07-01", weight: 72.6 },
        { date: "2026-08-01", weight: 72.0 }
    ]

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => document.querySelectorAll(selector);


/* =========================================================
   INITIALISATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initNavigation();

    initCharts();

    initTimer();

    initRestTimer();

    initSets();

    initExerciseSearch();

    initExerciseFilters();

    initTheme();

    initGenerator();

    initCalendar();

    initMeasurements();

    updateDate();

});


/* =========================================================
   NAVIGATION
========================================================= */

function initNavigation() {

    const navItems = $$(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const section = item.dataset.section;

            showSection(section);

        });

    });


    $$("[data-section-target]").forEach(button => {

        button.addEventListener("click", () => {

            showSection(button.dataset.sectionTarget);

        });

    });


    $("#mobileMenu").addEventListener("click", () => {

        $("#sidebar").classList.toggle("open");

    });

}


function showSection(sectionId) {

    $$(".page-section").forEach(section => {

        section.classList.remove("active");

    });


    const target = document.getElementById(sectionId);

    if (!target) return;

    target.classList.add("active");


    $$(".nav-item").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionId
        );

    });


    const titles = {

        dashboard: "Bonjour, athlète 👋",
        workout: "Entraînement du jour",
        programs: "Mes programmes",
        exercises: "Bibliothèque d'exercices",
        calendar: "Calendrier d'entraînement",
        statistics: "Tes performances",
        body: "Évolution corporelle"

    };


    $("#pageHeading").textContent =
        titles[sectionId] || "SportFlow";


    $("#sidebar").classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const date = new Date();

    const formatted = date.toLocaleDateString(
        "fr-FR",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    $("#currentDate").textContent = formatted;

}


/* =========================================================
   CHARTS
========================================================= */

function chartDefaults() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                backgroundColor: "#151821",

                titleColor: "#f4f5f7",

                bodyColor: "#858b9b",

                borderColor: "rgba(255,255,255,.08)",

                borderWidth: 1,

                padding: 10,

                displayColors: false

            }

        },

        scales: {

            x: {

                grid: {
                    display: false
                },

                ticks: {
                    color: "#5f6472",
                    font: {
                        size: 9
                    }
                }

            },

            y: {

                grid: {
                    color: "rgba(255,255,255,.045)"
                },

                ticks: {
                    color: "#5f6472",
                    font: {
                        size: 9
                    }
                }

            }

        }

    };

}


function initCharts() {

    if (typeof Chart === "undefined") {

        console.warn(
            "Chart.js n'est pas disponible."
        );

        return;

    }


    createPerformanceChart();

    createStrengthChart();

    createBodyChart();

}


function createPerformanceChart() {

    const canvas = $("#performanceChart");

    if (!canvas) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Lun",
                "Mar",
                "Mer",
                "Jeu",
                "Ven",
                "Sam",
                "Dim"
            ],

            datasets: [

                {

                    data: [
                        720,
                        910,
                        680,
                        1250,
                        980,
                        1420,
                        1120
                    ],

                    borderColor: "#c9ff39",

                    backgroundColor:
                        "rgba(201,255,57,.08)",

                    fill: true,

                    tension: .4,

                    pointRadius: 0,

                    pointHoverRadius: 5,

                    pointHoverBackgroundColor:
                        "#c9ff39"

                }

            ]

        },

        options: {

            ...chartDefaults(),

            interaction: {
                intersect: false,
                mode: "index"
            }

        }

    });

}


function createStrengthChart() {

    const canvas = $("#strengthChart");

    if (!canvas) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: [
                "Mai",
                "Juin",
                "Juil.",
                "Août"
            ],

            datasets: [

                {

                    data: [
                        72,
                        77,
                        84,
                        95
                    ],

                    borderColor: "#c9ff39",

                    backgroundColor:
                        "rgba(201,255,57,.08)",

                    fill: true,

                    tension: .4,

                    pointRadius: 3,

                    pointBackgroundColor: "#c9ff39"

                }

            ]

        },

        options: chartDefaults()

    });

}


function createBodyChart() {

    const canvas = $("#bodyChart");

    if (!canvas) return;


    new Chart(canvas, {

        type: "line",

        data: {

            labels: state.measurements.map(
                item => formatShortDate(item.date)
            ),

            datasets: [

                {

                    data: state.measurements.map(
                        item => item.weight
                    ),

                    borderColor: "#c9ff39",

                    backgroundColor:
                        "rgba(201,255,57,.07)",

                    fill: true,

                    tension: .35,

                    pointRadius: 4,

                    pointBackgroundColor: "#c9ff39"

                }

            ]

        },

        options: {

            ...chartDefaults(),

            scales: {

                ...chartDefaults().scales,

                y: {

                    ...chartDefaults().scales.y,

                    suggestedMin: 68,

                    suggestedMax: 76

                }

            }

        }

    });

}


/* =========================================================
   WORKOUT TIMER
========================================================= */

function initTimer() {

    const button = $("#timerButton");

    if (!button) return;


    button.addEventListener("click", () => {

        if (state.timer.running) {

            stopWorkoutTimer();

        } else {

            startWorkoutTimer();

        }

    });

}


function startWorkoutTimer() {

    state.timer.running = true;

    $("#timerButton").innerHTML =
        '<i class="fa-solid fa-pause"></i>';


    state.timer.interval = setInterval(() => {

        state.timer.seconds++;

        $("#workoutTimer").textContent =
            formatTime(state.timer.seconds);

    }, 1000);

}


function stopWorkoutTimer() {

    state.timer.running = false;

    clearInterval(state.timer.interval);

    $("#timerButton").innerHTML =
        '<i class="fa-solid fa-play"></i>';

}


/* =========================================================
   REST TIMER
========================================================= */

function initRestTimer() {

    const restButton = $("#restButton");

    if (!restButton) return;


    $$("[data-rest]").forEach(button => {

        button.addEventListener("click", () => {

            state.rest.seconds =
                Number(button.dataset.rest);

            state.rest.running = false;

            clearInterval(state.rest.interval);

            $("#restTimer").textContent =
                formatTime(state.rest.seconds);


            $$("[data-rest]").forEach(item =>
                item.classList.remove("active")
            );

            button.classList.add("active");

        });

    });


    restButton.addEventListener("click", () => {

        if (state.rest.running) {

            stopRestTimer();

        } else {

            startRestTimer();

        }

    });

}


function startRestTimer() {

    state.rest.running = true;

    $("#restButton").innerHTML =
        '<i class="fa-solid fa-pause"></i>';


    state.rest.interval = setInterval(() => {

        state.rest.seconds--;

        $("#restTimer").textContent =
            formatTime(state.rest.seconds);


        if (state.rest.seconds <= 0) {

            stopRestTimer();

            playBeep();

            $("#restTimer").textContent = "00:00";

        }

    }, 1000);

}


function stopRestTimer() {

    state.rest.running = false;

    clearInterval(state.rest.interval);

    $("#restButton").innerHTML =
        '<i class="fa-solid fa-play"></i>';

}


function playBeep() {

    try {

        const audio =
            new Audio(
                "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
            );

        audio.play();

    } catch (error) {

        console.log("Timer terminé");

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

    const remaining =
        (seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${remaining}`;

}


/* =========================================================
   SETS
========================================================= */

function initSets() {

    $$(".set-check").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("checked");

            updateWorkoutProgress();

        });

    });


    $("#addSet").addEventListener("click", () => {

        const table = $(".sets-table");

        const rows =
            table.querySelectorAll(".set-row");

        const number =
            rows.length + 1;


        const row =
            document.createElement("div");

        row.className = "set-row";

        row.innerHTML = `

            <span class="set-number">
                ${String(number).padStart(2, "0")}
            </span>

            <input type="number" value="70">

            <input type="number" value="8">

            <input type="number" value="8">

            <button class="set-check">
                <i class="fa-solid fa-check"></i>
            </button>

        `;


        table.appendChild(row);


        row.querySelector(".set-check")
            .addEventListener("click", function () {

                this.classList.toggle("checked");

                updateWorkoutProgress();

            });

    });

}


function updateWorkoutProgress() {

    const checked =
        document.querySelectorAll(
            ".set-check.checked"
        ).length;


    const total =
        document.querySelectorAll(
            ".set-check"
        ).length;


    const percent =
        total === 0
            ? 0
            : Math.round(
                (checked / total) * 100
            );


    $("#workoutProgress").textContent =
        `${percent}%`;

}


/* =========================================================
   EXERCISE SEARCH
========================================================= */

function initExerciseSearch() {

    const input = $("#exerciseSearch");

    if (!input) return;


    input.addEventListener("input", () => {

        const query =
            input.value.toLowerCase().trim();


        $$(".library-card").forEach(card => {

            const text =
                card.textContent.toLowerCase();


            card.style.display =
                text.includes(query)
                    ? ""
                    : "none";

        });

    });

}


/* =========================================================
   EXERCISE FILTERS
========================================================= */

function initExerciseFilters() {

    $$(".filter").forEach(button => {

        button.addEventListener("click", () => {

            $$(".filter").forEach(
                item => item.classList.remove("active")
            );

            button.classList.add("active");


            const category =
                button.dataset.filter;


            $$(".library-card").forEach(card => {

                if (
                    category === "all" ||
                    card.dataset.category === category
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

}


/* =========================================================
   THEME
========================================================= */

function initTheme() {

    const button = $("#themeButton");

    const savedTheme =
        localStorage.getItem("sportflow_theme");


    if (savedTheme === "light") {

        document.body.classList.add("light");

        button.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    }


    button.addEventListener("click", () => {

        document.body.classList.toggle("light");


        const light =
            document.body.classList.contains("light");


        localStorage.setItem(
            "sportflow_theme",
            light ? "light" : "dark"
        );


        button.innerHTML = light

            ? '<i class="fa-solid fa-sun"></i>'

            : '<i class="fa-solid fa-moon"></i>';

    });

}


/* =========================================================
   PROGRAM GENERATOR
========================================================= */

function initGenerator() {

    const modal = $("#generatorModal");

    const resultModal = $("#resultModal");


    $("#openGenerator").addEventListener(
        "click",
        () => modal.classList.add("open")
    );


    $("#openGenerator2").addEventListener(
        "click",
        () => modal.classList.add("open")
    );


    $("#closeGenerator").addEventListener(
        "click",
        () => modal.classList.remove("open")
    );


    $("#closeResult").addEventListener(
        "click",
        () => resultModal.classList.remove("open")
    );


    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("open");

        }

    });


    resultModal.addEventListener("click", event => {

        if (event.target === resultModal) {

            resultModal.classList.remove("open");

        }

    });


    const daysInput = $("#days");

    daysInput.addEventListener("input", () => {

        $("#daysValue").textContent =
            `${daysInput.value} jour${daysInput.value > 1 ? "s" : ""}`;

    });


    $("#programForm").addEventListener(
        "submit",
        generateProgram
    );


    $("#saveProgram").addEventListener(
        "click",
        saveGeneratedProgram
    );

}


function generateProgram(event) {

    event.preventDefault();


    const goal = $("#goal").value;

    const level = $("#level").value;

    const days = Number($("#days").value);

    const equipment = $("#equipment").value;


    const goalNames = {

        muscle: "Hypertrophie intelligente",

        strength: "Force fondamentale",

        weightloss: "Performance & perte de gras",

        fitness: "Condition physique"

    };


    const descriptions = {

        muscle:
            "Un programme centré sur le volume musculaire, la progression et une récupération maîtrisée.",

        strength:
            "Une structure orientée force avec des mouvements fondamentaux et une progression progressive.",

        weightloss:
            "Un mélange de musculation et de conditionnement pour augmenter la dépense énergétique.",

        fitness:
            "Un programme équilibré pour améliorer endurance, mobilité, force et condition générale."

    };


    const templates = {

        2: [
            "Full Body A",
            "Full Body B"
        ],

        3: [
            "Push",
            "Pull",
            "Legs"
        ],

        4: [
            "Upper A",
            "Lower A",
            "Upper B",
            "Lower B"
        ],

        5: [
            "Push",
            "Pull",
            "Legs",
            "Upper",
            "Lower"
        ],

        6: [
            "Push A",
            "Pull A",
            "Legs A",
            "Push B",
            "Pull B",
            "Legs B"
        ]

    };


    const generatedDays =
        templates[days];


    state.program = {

        title:
            goalNames[goal],

        description:
            descriptions[goal],

        days,
        level,
        equipment,
        generatedDays

    };


    $("#generatedTitle").textContent =
        goalNames[goal];


    $("#generatedDescription").textContent =
        descriptions[goal];


    const container =
        $("#generatedDays");


    container.innerHTML = "";


    generatedDays.forEach(
        (day, index) => {

            const card =
                document.createElement("div");

            card.className =
                "generated-day";

            card.innerHTML = `

                <strong>
                    Jour ${index + 1} · ${day}
                </strong>

                <span>
                    ${getExercisesForGoal(goal, index)}
                </span>

            `;

            container.appendChild(card);

        }
    );


    $("#generatorModal").classList.remove("open");

    $("#resultModal").classList.add("open");

}


function getExercisesForGoal(goal, index) {

    const programs = {

        muscle: [
            "Pectoraux · épaules · triceps",
            "Dos · biceps · arrière épaules",
            "Quadriceps · ischios · mollets",
            "Upper body · bras",
            "Lower body · core",
            "Full body"
        ],

        strength: [
            "Bench · triceps · épaules",
            "Squat · jambes · core",
            "Deadlift · dos · grip",
            "Bench · haut du corps",
            "Squat · jambes",
            "Deadlift · dos"
        ],

        weightloss: [
            "Full body + cardio",
            "Circuit training",
            "Jambes + cardio",
            "Upper body + cardio",
            "Full body HIIT",
            "Conditionnement"
        ],

        fitness: [
            "Full body",
            "Cardio + mobilité",
            "Force générale",
            "Full body",
            "Core + cardio",
            "Mobilité + endurance"
        ]

    };


    const list =
        programs[goal];

    return list[index % list.length];

}


function saveGeneratedProgram() {

    if (!state.program) return;


    const programs =
        JSON.parse(
            localStorage.getItem("sportflow_programs")
        ) || [];


    programs.push({

        ...state.program,

        createdAt:
            new Date().toISOString()

    });


    localStorage.setItem(
        "sportflow_programs",
        JSON.stringify(programs)
    );


    $("#resultModal").classList.remove("open");


    showToast(
        "Programme enregistré avec succès."
    );

}


/* =========================================================
   CALENDAR
========================================================= */

function initCalendar() {

    renderCalendar();


    $("#previousMonth").addEventListener(
        "click",
        () => {

            state.calendar.date.setMonth(
                state.calendar.date.getMonth() - 1
            );

            renderCalendar();

        }
    );


    $("#nextMonth").addEventListener(
        "click",
        () => {

            state.calendar.date.setMonth(
                state.calendar.date.getMonth() + 1
            );

            renderCalendar();

        }
    );


    $("#todayCalendar").addEventListener(
        "click",
        () => {

            state.calendar.date = new Date();

            renderCalendar();

        }
    );

}


function renderCalendar() {

    const date =
        state.calendar.date;


    const year =
        date.getFullYear();

    const month =
        date.getMonth();


    const monthName =
        date.toLocaleDateString(
            "fr-FR",
            {
                month: "long",
                year: "numeric"
            }
        );


    $("#calendarMonth").textContent =
        capitalize(monthName);


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    let startingDay =
        firstDay.getDay();


    // Dimanche = 0
    // On veut lundi = 0

    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    const container =
        $("#calendarDays");


    container.innerHTML = "";


    for (
        let i = startingDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousDays - i;


        const cell =
            createCalendarDay(
                day,
                true,
                year,
                month - 1
            );


        container.appendChild(cell);

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            createCalendarDay(
                day,
                false,
                year,
                month
            );


        container.appendChild(cell);

    }


    const totalCells =
        container.children.length;


    const remaining =
        Math.ceil(totalCells / 7) * 7 -
        totalCells;


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        const cell =
            createCalendarDay(
                day,
                true,
                year,
                month + 1
            );


        container.appendChild(cell);

    }

}


function createCalendarDay(
    day,
    muted,
    year,
    month
) {

    const cell =
        document.createElement("div");


    cell.className =
        "calendar-day";


    if (muted) {

        cell.classList.add("muted");

    }


    const current =
        new Date();


    if (

        !muted &&

        day === current.getDate() &&

        month === current.getMonth() &&

        year === current.getFullYear()

    ) {

        cell.classList.add("today");

    }


    const workoutDays = [
        3,
        5,
        7,
        10,
        12,
        14,
        17,
        19,
        21,
        24,
        26,
        28
    ];


    if (
        !muted &&
        workoutDays.includes(day)
    ) {

        cell.classList.add("workout");

        cell.innerHTML = `

            ${day}

            <span class="day-workout">
                Entraînement
            </span>

        `;

    } else {

        cell.textContent = day;

    }


    return cell;

}


/* =========================================================
   MEASUREMENTS
========================================================= */

function initMeasurements() {

    $("#addMeasurement").addEventListener(
        "click",
        () => {

            const weight =
                prompt(
                    "Entre ton poids actuel en kg :"
                );


            if (!weight) return;


            const numericWeight =
                parseFloat(weight);


            if (
                Number.isNaN(numericWeight) ||
                numericWeight <= 0
            ) {

                showToast(
                    "Poids invalide."
                );

                return;

            }


            const today =
                new Date()
                    .toISOString()
                    .split("T")[0];


            state.measurements.push({

                date: today,

                weight: numericWeight

            });


            localStorage.setItem(
                "sportflow_measurements",
                JSON.stringify(
                    state.measurements
                )
            );


            $("#bodyWeight").textContent =
                numericWeight.toFixed(1);


            $("#currentWeight").innerHTML =
                `${numericWeight}<span> kg</span>`;


            showToast(
                "Nouvelle mesure enregistrée."
            );

        }
    );

}


/* =========================================================
   UTILITIES
========================================================= */

function formatShortDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "fr-FR",
        {
            month: "short"
        }
    );

}


function capitalize(value) {

    return value.charAt(0).toUpperCase() +
        value.slice(1);

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const existing =
        document.querySelector(".sportflow-toast");


    if (existing) {
        existing.remove();
    }


    const toast =
        document.createElement("div");


    toast.className =
        "sportflow-toast";


    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>${message}</span>

    `;


    Object.assign(
        toast.style,
        {

            position: "fixed",

            bottom: "25px",

            right: "25px",

            zIndex: "9999",

            display: "flex",

            alignItems: "center",

            gap: "10px",

            padding: "13px 16px",

            background: "#151821",

            border: "1px solid rgba(255,255,255,.1)",

            borderRadius: "11px",

            color: "#f4f5f7",

            fontSize: "10px",

            boxShadow: "0 15px 40px rgba(0,0,0,.35)"

        }

    );


    toast.querySelector("i").style.color =
        "#c9ff39";


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(10px)";

        toast.style.transition = ".3s";


        setTimeout(
            () => toast.remove(),
            300
        );

    }, 2500);

}


/* =========================================================
   DEMO DATA INTERACTION
========================================================= */

const chartPeriod =
    $("#chartPeriod");


if (chartPeriod) {

    chartPeriod.addEventListener(
        "change",
        event => {

            showToast(
                `Période changée : ${event.target.options[event.target.selectedIndex].text}`
            );

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        // Espace = démarrer / arrêter le chrono
        if (
            event.code === "Space" &&
            !["INPUT", "SELECT"].includes(
                document.activeElement.tagName
            )
        ) {

            event.preventDefault();

            $("#timerButton")?.click();

        }

        // Escape = fermer les modales
        if (event.key === "Escape") {

            $$(".modal-overlay").forEach(
                modal =>
                    modal.classList.remove("open")
            );

        }

    }
);