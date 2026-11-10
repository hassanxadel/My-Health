// Core state — same shape as the original app: one goal string, a list of workout strings.
let fitnessGoal = localStorage.getItem('myhealth.fitnessGoal') || '';
let workouts = JSON.parse(localStorage.getItem('myhealth.workouts') || '[]');

function setFitnessGoal(goal) {
    fitnessGoal = goal;
    localStorage.setItem('myhealth.fitnessGoal', fitnessGoal);
    renderGoal();
    updateProgressReport();
}

function recordWorkout(workout) {
    workouts.push(workout);
    localStorage.setItem('myhealth.workouts', JSON.stringify(workouts));
    renderWorkouts();
    updateProgressReport();
}

function renderGoal() {
    const text = document.getElementById('currentGoalText');
    text.textContent = fitnessGoal ? fitnessGoal : 'No goal set yet — write one above.';
}

function renderLedger(listEl) {
    if (workouts.length === 0) {
        listEl.innerHTML = '<li class="ledger-empty">No workouts logged yet — add your first one above.</li>';
        return;
    }
    listEl.innerHTML = workouts
        .map(w => `<li>${escapeHtml(w)}</li>`)
        .join('');
}

function renderWorkouts() {
    renderLedger(document.getElementById('workoutLedger'));
}

function updateProgressReport() {
    document.getElementById('statGoal').textContent = fitnessGoal ? fitnessGoal : '—';
    document.getElementById('statCount').textContent = String(workouts.length);
    renderLedger(document.getElementById('progressLedger'));
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

// Form wiring: validate, clear errors, hand off to the core functions above.

function initGoalForm() {
    const form = document.getElementById('goalForm');
    const input = document.getElementById('fitnessGoal');
    const error = document.getElementById('goalError');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value.trim();
        if (!value) {
            input.classList.add('has-error');
            error.hidden = false;
            return;
        }
        input.classList.remove('has-error');
        error.hidden = true;
        setFitnessGoal(value);
        input.value = '';
    });
}

function initWorkoutForm() {
    const form = document.getElementById('workoutForm');
    const input = document.getElementById('workout');
    const error = document.getElementById('workoutError');
    const success = document.getElementById('workoutSuccess');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = input.value.trim();
        success.hidden = true;
        if (!value) {
            input.classList.add('has-error');
            error.hidden = false;
            return;
        }
        input.classList.remove('has-error');
        error.hidden = true;
        recordWorkout(value);
        input.value = '';
        success.hidden = false;
    });
}

// Tabs

function initTabs() {
    const tabs = Array.from(document.querySelectorAll('.tab'));
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                const selected = t === tab;
                t.setAttribute('aria-selected', String(selected));
                t.tabIndex = selected ? 0 : -1;
                document.getElementById(t.dataset.target).hidden = !selected;
            });
            tab.focus();
        });
    });
}

// Theme toggle (persisted)

function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const stored = localStorage.getItem('myhealth.theme');
    if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
        toggle.setAttribute('aria-pressed', String(stored === 'dark'));
    }
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme')
            || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('myhealth.theme', next);
        toggle.setAttribute('aria-pressed', String(next === 'dark'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGoalForm();
    initWorkoutForm();
    initTabs();
    initTheme();
    renderGoal();
    renderWorkouts();
    updateProgressReport();
});
