// Question management system
class QuestionManager {
    constructor() {
        this.questions = JSON.parse(localStorage.getItem('questions')) || [];
    }

    addQuestion(question) {
        this.questions.push({
            id: Date.now().toString(),
            ...question,
            createdBy: auth.getCurrentUser()?.id
        });
        this.saveQuestions();
    }

    getQuestions() {
        return this.questions;
    }

    deleteQuestion(id) {
        this.questions = this.questions.filter(q => q.id !== id);
        this.saveQuestions();
    }

    saveQuestions() {
        localStorage.setItem('questions', JSON.stringify(this.questions));
    }
}

const questionManager = new QuestionManager();