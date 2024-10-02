// public/script.js

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    

    try {
        const response = await fetch('https://quiz-me-new.vercel.app/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            console.log(response);
            
            alert('Login failed login form');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred login form' );
    }
});

async function loadQuiz(topic) {
    const token = localStorage.getItem('token');
    console.log(topic);
    
    const response = await fetch(`https://quiz-me-new.vercel.app/api/quiz/${topic}`, {
        method: 'POST', // This is important
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Add any necessary data to the request body
    });
    

    if (!response.ok) {
        alert('Failed to load quiz from script.js');
       
        
        return;
    }

    const data = await response.json();
    const questions = data.quiz.quiz
    console.log(questions);
    // alert(questions.quiz.quiz);
    
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    questions.forEach((q, index) => {
        let questionHTML = `<p>${index + 1}. ${q.question}</p>`;
        questionHTML += `
            <input type="radio" name="question${index}" value="true"> True<br>
            <input type="radio" name="question${index}" value="false"> False<br>
        `;
        quizContainer.innerHTML += questionHTML;
    });

    quizContainer.innerHTML += '<button class="btn btn-primary" onclick="submitQuiz()">Submit Quiz</button>';
}



async function submitQuiz() {
    const token = localStorage.getItem('token');
    const quizForm = document.getElementById('quizContainer');
    const answers = [];

    [...quizForm.querySelectorAll('input[type=radio]:checked')].forEach((input) => {
        answers.push({ questionIndex: input.name.replace('question', ''), answer: input.value });
    });

    try {
        const response = await fetch('https://quiz-me-new.vercel.app/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answers })
        });

        if (!response.ok) {
            alert('Failed to submit quiz');
            return;
        }

        const result = await response.json();

        // Store the score and total questions in localStorage for use in results.html
        localStorage.setItem('score', result.score);
        localStorage.setItem('totalQuestions', result.totalQuestions);

        // Redirect to the results page
        window.location.href = 'results.html';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
}


// async function submitQuiz() {
//     const token = localStorage.getItem('token');
//     const quizForm = document.getElementById('quizContainer');
//     const answers = [];

//     [...quizForm.querySelectorAll('input[type=radio]:checked')].forEach((input) => {
//         answers.push({ questionIndex: input.name.replace('question', ''), answer: input.value });
//     });

//     try {
//         const response = await fetch('/submit-quiz', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ answers })
//         });

//         if (!response.ok) {
//             alert('Failed to submit quiz');
//             return;
//         }

//         const result = await response.json();
//         alert(`Your Score: ${result.score}/${result.totalQuestions}`);
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred');
//     }
// }
