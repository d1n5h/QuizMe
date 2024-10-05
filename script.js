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

// Applying fade-in animation and style for each question
questions.forEach((q, index) => {
    let questionHTML = `
        <div class="question-container" style="animation: fadeInUp 0.8s ease ${index * 0.2}s forwards; opacity: 0;">
            <p class="question-text">${index + 1}. ${q.question}</p>
            <label class="radio-label">
                <input type="radio" name="question${index}" value="true"> True
            </label>
            <br>
            <label class="radio-label">
                <input type="radio" name="question${index}" value="false"> False
            </label>
        </div>
    `;
    quizContainer.innerHTML += questionHTML;
});

// Submit button with animations
quizContainer.innerHTML += `
    <button class="btn btn-primary submit-btn" style="animation: fadeInUp 1s ease forwards; opacity: 0;" onclick="submitQuiz()">
        Submit Quiz
    </button>
`;

// Trigger the fade-in effect
setTimeout(() => {
    quizContainer.style.opacity = 1;
}, 100); 

// Add custom styles dynamically
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Question Container Styles */
    .question-container {
        background: linear-gradient(135deg, #ffecd2, #fcb69f); /* Shiny gradient */
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin-bottom: 1.5rem;
        transition: transform 0.3s ease, background 0.3s ease;
    }

    /* Hover effect for questions */
    .question-container:hover {
        transform: scale(1.03);
        background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
    }

    /* Question Text Style */
    .question-text {
        font-family: 'Poppins', sans-serif;
        font-size: 1.2rem;
        color: #333;
    }

    /* Radio Buttons Styling */
    .radio-label {
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        color: #555;
        margin-right: 1rem;
    }

    /* Submit Button Hover Effect */
    .submit-btn {
        background: linear-gradient(45deg, #6a11cb, #2575fc);
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 0.5rem;
        color: #fff;
        font-family: 'Poppins', sans-serif;
        cursor: pointer;
        transition: transform 0.3s ease, background 0.3s ease;
    }
    .submit-btn:hover {
        background: linear-gradient(45deg, #2575fc, #6a11cb);
        transform: scale(1.05);
    }
`;
document.head.appendChild(styleSheet);

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
