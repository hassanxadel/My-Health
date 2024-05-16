let fitnessGoal = '';
let workouts = [];

function setFitnessGoal() {
    fitnessGoal = document.getElementById('fitnessGoal').value;
    document.getElementById('progressReport').innerHTML = `<p>Fitness Goal: ${fitnessGoal}</p>`;
}

function recordWorkout() {
    let workout = document.getElementById('workout').value;
    workouts.push(workout);
    updateProgressReport();
}

function updateProgressReport() {
    let report = '<p>Recorded Workouts:</p><ul>';
    workouts.forEach(workout => {
        report += `<li>${workout}</li>`;
    });
    report += '</ul>';
    document.getElementById('progressReport').innerHTML = report;
}
