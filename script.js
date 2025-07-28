// Application AWS Cloud Practitioner Flashcards - Version Simplifiée
class AWSFlashcards {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswers = new Set(); // Support des réponses multiples
        this.sessionStats = {
            totalAnswered: 0,
            correctCount: 0,
            startTime: Date.now()
        };
        this.markedQuestions = new Set();
        this.incorrectQuestions = new Set();
        this.isAnswerShown = false;
        this.currentLanguage = 'fr'; // Langue par défaut
        this.translations = this.getTranslations();
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadQuestions();
    }

    initializeElements() {
        this.elements = {
            // Stats
            currentQuestion: document.getElementById('currentQuestion'),
            totalQuestions: document.getElementById('totalQuestions'),
            correctAnswers: document.getElementById('correctAnswers'),
            accuracy: document.getElementById('accuracy'),
            progressFill: document.getElementById('progressFill'),
            
            // Carte
            flashcard: document.getElementById('flashcard'),
            questionId: document.getElementById('questionId'),
            questionText: document.getElementById('questionText'),
            answersSection: document.getElementById('answersSection'),
            answerOptions: document.getElementById('answerOptions'),
            correctAnswer: document.getElementById('correctAnswer'),
            correctAnswerText: document.getElementById('correctAnswerText'),
            
            // Contrôles
            showAnswerBtn: document.getElementById('showAnswerBtn'),
            correctBtn: document.getElementById('correctBtn'),
            incorrectBtn: document.getElementById('incorrectBtn'),
            nextBtn: document.getElementById('nextBtn'),
            shuffleBtn: document.getElementById('shuffleBtn'),
            resetBtn: document.getElementById('resetBtn'),
            markBtn: document.getElementById('markBtn'),
            
            // Overlay
            loadingOverlay: document.getElementById('loadingOverlay'),
            
            // Modes
            modeRadios: document.querySelectorAll('input[name="mode"]'),
            
            // Langue
            languageSelector: document.getElementById('languageSelector')
        };
    }

    attachEventListeners() {
        // Boutons principaux
        this.elements.showAnswerBtn.addEventListener('click', () => this.showAnswer());
        this.elements.correctBtn.addEventListener('click', () => this.markAnswer(true));
        this.elements.incorrectBtn.addEventListener('click', () => this.markAnswer(false));
        this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());
        
        // Boutons additionnels
        this.elements.shuffleBtn.addEventListener('click', () => this.shuffleQuestions());
        this.elements.resetBtn.addEventListener('click', () => this.resetSession());
        this.elements.markBtn.addEventListener('click', () => this.toggleMark());
        
        // Modes
        this.elements.modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.changeMode(e.target.value);
                }
            });
        });

        // Sélecteur de langue
        if (this.elements.languageSelector) {
            this.elements.languageSelector.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    async loadQuestions() {
        try {
            this.showLoading(true);
            console.log('Chargement des questions...');
            
            const response = await fetch('aws_questions_extracted.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Données chargées:', data);
            
            // Vérifier la structure des données
            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Structure de données invalide');
            }
            
            // Adapter la structure des questions
            this.questions = data.questions.map((q, index) => ({
                question_id: q.question_id,
                question: q.question_text,
                option_a: this.cleanOption(q.options.A, 'A'),
                option_b: this.cleanOption(q.options.B, 'B'),
                option_c: this.cleanOption(q.options.C, 'C'),
                option_d: this.cleanOption(q.options.D, 'D'),
                option_e: q.options.E ? this.cleanOption(q.options.E, 'E') : null,
                correct_answers: Array.isArray(q.correct_answers) ? q.correct_answers : [q.correct_answers],
                source_file: q.source_file,
                originalIndex: index
            }));
            
            console.log('Questions adaptées:', this.questions.length);
            this.elements.totalQuestions.textContent = this.questions.length;
            
            this.showLoading(false);
            this.displayQuestion();
            this.updateStats();
            
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            this.showLoading(false);
            this.elements.questionText.textContent = 
                `Erreur: ${error.message}. Vérifiez que le fichier aws_questions_extracted.json existe et est accessible.`;
        }
    }

    cleanOption(optionText, letter) {
        if (!optionText) return '';
        // Retirer le préfixe "A.", "B.", etc.
        if (optionText.startsWith(`${letter}.`)) {
            return optionText.substring(2).trim();
        }
        return optionText.trim();
    }

    displayQuestion() {
        if (this.questions.length === 0) return;
        
        const question = this.questions[this.currentQuestionIndex];
        console.log('Affichage question:', question);
        
        // Réinitialiser l'état
        this.isAnswerShown = false;
        this.selectedAnswers.clear();
        this.elements.correctAnswer.style.display = 'none';
        
        // Afficher la question
        this.elements.questionId.textContent = `Question #${question.question_id || this.currentQuestionIndex + 1}`;
        this.elements.questionText.textContent = question.question;
        
        // Afficher les options de réponse
        this.displayAnswerOptions(question);
        this.elements.answersSection.style.display = 'block';
        
        // Réinitialiser les contrôles
        this.resetControls();
        
        // Mettre à jour les stats
        this.elements.currentQuestion.textContent = this.currentQuestionIndex + 1;
        this.updateProgress();
        
        // Gérer le marquage
        this.updateMarkStatus();
    }

    displayAnswerOptions(question) {
        this.elements.answerOptions.innerHTML = '';
        
        const isMultipleChoice = question.correct_answers.length > 1;
        
        // Ajouter l'indication pour les réponses multiples
        if (isMultipleChoice && !this.isAnswerShown) {
            const hintDiv = document.createElement('div');
            hintDiv.className = 'multiple-choice-hint';
            hintDiv.innerHTML = `
                <i class="fas fa-info-circle"></i>
                ${this.getTranslation('multiple_choice_hint')}
            `;
            this.elements.answerOptions.appendChild(hintDiv);
        }
        
        const options = ['A', 'B', 'C', 'D', 'E'];
        
        options.forEach(letter => {
            const optionKey = `option_${letter.toLowerCase()}`;
            const optionText = question[optionKey];
            
            if (optionText) {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'answer-option';
                optionDiv.dataset.answer = letter;
                
                // Ajouter la classe pour réponses multiples
                if (isMultipleChoice) {
                    optionDiv.classList.add('multiple-choice');
                }
                
                // Si la réponse a été montrée, colorer les bonnes/mauvaises réponses
                if (this.isAnswerShown) {
                    if (question.correct_answers.includes(letter)) {
                        optionDiv.classList.add('correct');
                    }
                    if (this.selectedAnswers.has(letter) && !question.correct_answers.includes(letter)) {
                        optionDiv.classList.add('incorrect');
                    }
                    if (this.selectedAnswers.has(letter)) {
                        optionDiv.classList.add('selected');
                    }
                } else {
                    // Mode sélection - ajouter les gestionnaires de clic
                    optionDiv.classList.add('selectable');
                    optionDiv.addEventListener('click', () => this.selectAnswer(letter));
                }
                
                optionDiv.innerHTML = `
                    <div class="answer-letter">${letter}</div>
                    <div class="answer-text">${optionText}</div>
                `;
                
                this.elements.answerOptions.appendChild(optionDiv);
            }
        });
    }

    selectAnswer(letter) {
        if (this.isAnswerShown) return;
        
        console.log('Réponse sélectionnée:', letter);
        
        const question = this.questions[this.currentQuestionIndex];
        const isMultipleChoice = question.correct_answers.length > 1;
        
        const selectedOption = document.querySelector(`[data-answer="${letter}"]`);
        
        if (isMultipleChoice) {
            // Mode réponses multiples - toggle la sélection
            if (this.selectedAnswers.has(letter)) {
                this.selectedAnswers.delete(letter);
                selectedOption.classList.remove('selected');
            } else {
                this.selectedAnswers.add(letter);
                selectedOption.classList.add('selected');
            }
        } else {
            // Mode réponse unique - remplacer la sélection
            document.querySelectorAll('.answer-option.selected').forEach(el => {
                el.classList.remove('selected');
            });
            this.selectedAnswers.clear();
            this.selectedAnswers.add(letter);
            selectedOption.classList.add('selected');
        }
        
        // Mettre à jour le bouton
        const selectedCount = this.selectedAnswers.size;
        if (selectedCount > 0) {
            const buttonText = this.getTranslation('checkAnswer');
            this.elements.showAnswerBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${buttonText}`;
        } else {
            const buttonText = this.getTranslation('showAnswer');
            this.elements.showAnswerBtn.innerHTML = `<i class="fas fa-eye"></i> ${buttonText}`;
        }
    }

    showAnswer() {
        if (this.isAnswerShown) return;
        
        const question = this.questions[this.currentQuestionIndex];
        this.isAnswerShown = true;
        
        console.log('Affichage de la réponse');
        
        // Si une réponse était sélectionnée, marquer automatiquement
        if (this.selectedAnswers.size > 0) {
            const selectedAnswers = Array.from(this.selectedAnswers);
            const isCorrect = this.areAnswersCorrect(selectedAnswers, question.correct_answers);
            console.log('Auto-évaluation:', selectedAnswers, 'correcte:', isCorrect);
            this.sessionStats.totalAnswered++;
            if (isCorrect) {
                this.sessionStats.correctCount++;
            } else {
                this.incorrectQuestions.add(this.currentQuestionIndex);
            }
            this.updateStats();
        }
        
        // Réafficher les options avec les couleurs
        this.displayAnswerOptions(question);
        
        // Afficher la bonne réponse
        const correctAnswersText = question.correct_answers.join(', ');
        const correctText = this.getTranslation('correctAnswer');
        this.elements.correctAnswerText.textContent = `${correctText}: ${correctAnswersText}`;
        this.elements.correctAnswer.style.display = 'block';
        
        // Changer les contrôles
        if (this.selectedAnswers.size > 0) {
            // Si réponse sélectionnée, montrer directement "Suivant"
            this.elements.showAnswerBtn.style.display = 'none';
            this.elements.correctBtn.style.display = 'none';
            this.elements.incorrectBtn.style.display = 'none';
            this.elements.nextBtn.style.display = 'inline-flex';
        } else {
            // Si pas de sélection, montrer les boutons correct/incorrect
            this.elements.showAnswerBtn.style.display = 'none';
            this.elements.correctBtn.style.display = 'inline-flex';
            this.elements.incorrectBtn.style.display = 'inline-flex';
            this.elements.nextBtn.style.display = 'none';
        }
    }

    markAnswer(isCorrect) {
        this.sessionStats.totalAnswered++;
        if (isCorrect) {
            this.sessionStats.correctCount++;
            this.incorrectQuestions.delete(this.currentQuestionIndex);
        } else {
            this.incorrectQuestions.add(this.currentQuestionIndex);
        }
        
        this.updateStats();
        
        // Montrer le bouton suivant
        this.elements.correctBtn.style.display = 'none';
        this.elements.incorrectBtn.style.display = 'none';
        this.elements.nextBtn.style.display = 'inline-flex';
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            const message = this.currentLanguage === 'fr' 
                ? 'Vous avez terminé toutes les questions ! Voulez-vous recommencer ?'
                : 'You have completed all questions! Do you want to restart?';
                
            if (confirm(message)) {
                this.resetSession();
            }
        }
    }

    resetControls() {
        this.elements.showAnswerBtn.style.display = 'inline-flex';
        this.elements.showAnswerBtn.innerHTML = `<i class="fas fa-eye"></i> ${this.getTranslation('showAnswer')}`;
        this.elements.correctBtn.style.display = 'none';
        this.elements.incorrectBtn.style.display = 'none';
        this.elements.nextBtn.style.display = 'none';
    }

    updateStats() {
        this.elements.correctAnswers.textContent = this.sessionStats.correctCount;
        
        const accuracy = this.sessionStats.totalAnswered > 0 
            ? Math.round((this.sessionStats.correctCount / this.sessionStats.totalAnswered) * 100)
            : 0;
        
        this.elements.accuracy.textContent = `${accuracy}%`;
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    updateMarkStatus() {
        const currentIndex = this.currentQuestionIndex;
        if (this.markedQuestions.has(currentIndex)) {
            this.elements.flashcard.classList.add('marked');
            this.elements.markBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${this.getTranslation('marked')}`;
        } else {
            this.elements.flashcard.classList.remove('marked');
            this.elements.markBtn.innerHTML = `<i class="fas fa-bookmark"></i> ${this.getTranslation('mark')}`;
        }
    }

    toggleMark() {
        const currentIndex = this.currentQuestionIndex;
        if (this.markedQuestions.has(currentIndex)) {
            this.markedQuestions.delete(currentIndex);
        } else {
            this.markedQuestions.add(currentIndex);
        }
        this.updateMarkStatus();
    }

    shuffleQuestions() {
        const message = this.currentLanguage === 'fr' 
            ? 'Voulez-vous mélanger les questions ? Cela recommencera la session.'
            : 'Do you want to shuffle the questions? This will restart the session.';
            
        if (confirm(message)) {
            for (let i = this.questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
            }
            this.resetSession();
        }
    }

    resetSession() {
        this.currentQuestionIndex = 0;
        this.selectedAnswers.clear();
        this.sessionStats = {
            totalAnswered: 0,
            correctCount: 0,
            startTime: Date.now()
        };
        this.incorrectQuestions.clear();
        this.displayQuestion();
        this.updateStats();
    }

    changeMode(mode) {
        // Implémentation simple des modes
        console.log('Changement de mode:', mode);
        switch (mode) {
            case 'quiz':
                this.shuffleQuestions();
                break;
            case 'review':
                if (this.incorrectQuestions.size === 0) {
                    const message = this.currentLanguage === 'fr' 
                        ? 'Aucune question incorrecte à réviser !'
                        : 'No incorrect questions to review!';
                    alert(message);
                    document.querySelector('input[name="mode"][value="study"]').checked = true;
                } else {
                    // Filtrer les questions incorrectes
                    const incorrectIndices = Array.from(this.incorrectQuestions);
                    this.questions = incorrectIndices.map(index => this.questions[index]);
                    this.currentQuestionIndex = 0;
                    this.displayQuestion();
                }
                break;
        }
    }

    showLoading(show) {
        this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!this.isAnswerShown) {
                    this.showAnswer();
                } else if (this.elements.nextBtn.style.display !== 'none') {
                    this.nextQuestion();
                }
                break;
                
            case 'a':
            case 'A':
                e.preventDefault();
                if (!this.isAnswerShown) this.selectAnswer('A');
                break;
                
            case 'b':
            case 'B':
                e.preventDefault();
                if (!this.isAnswerShown) this.selectAnswer('B');
                break;
                
            case 'c':
            case 'C':
                e.preventDefault();
                if (!this.isAnswerShown) this.selectAnswer('C');
                break;
                
            case 'd':
            case 'D':
                e.preventDefault();
                if (!this.isAnswerShown) this.selectAnswer('D');
                break;
                
            case 'e':
            case 'E':
                e.preventDefault();
                if (!this.isAnswerShown) this.selectAnswer('E');
                break;
                
            case '1':
                e.preventDefault();
                if (this.elements.correctBtn.style.display !== 'none') {
                    this.markAnswer(true);
                }
                break;
                
            case '0':
                e.preventDefault();
                if (this.elements.incorrectBtn.style.display !== 'none') {
                    this.markAnswer(false);
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (this.elements.nextBtn.style.display !== 'none') {
                    this.nextQuestion();
                }
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                if (this.currentQuestionIndex > 0) {
                    this.currentQuestionIndex--;
                    this.displayQuestion();
                }
                break;
                
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleMark();
                break;
                
            case 'r':
            case 'R':
                e.preventDefault();
                this.resetSession();
                break;
                
            case 's':
            case 'S':
                e.preventDefault();
                this.shuffleQuestions();
                break;
        }
    }

    // Méthode pour comparer les réponses
    areAnswersCorrect(selectedAnswers, correctAnswers) {
        if (selectedAnswers.length !== correctAnswers.length) return false;
        const selectedSet = new Set(selectedAnswers);
        const correctSet = new Set(correctAnswers);
        for (let answer of selectedSet) {
            if (!correctSet.has(answer)) return false;
        }
        return true;
    }

    // Système de traductions
    getTranslations() {
        return {
            fr: {
                showAnswer: 'Voir la réponse',
                checkAnswer: 'Vérifier ma réponse',
                correctAnswer: 'Bonne(s) réponse(s)',
                correct: 'Correct',
                incorrect: 'Incorrect',
                next: 'Suivant',
                shuffle: 'Mélanger',
                restart: 'Recommencer',
                mark: 'Marquer',
                marked: 'Marqué',
                studyMode: 'Mode Étude',
                quizMode: 'Mode Quiz',
                reviewMode: 'Révision Erreurs',
                question: 'Question',
                total: 'Total',
                correct_answers: 'Correctes',
                accuracy: 'Précision',
                multiple_choice_hint: 'Question à réponses multiples - Sélectionnez toutes les bonnes réponses'
            },
            en: {
                showAnswer: 'Show answer',
                checkAnswer: 'Check my answer',
                correctAnswer: 'Correct answer(s)',
                correct: 'Correct',
                incorrect: 'Incorrect',
                next: 'Next',
                shuffle: 'Shuffle',
                restart: 'Restart',
                mark: 'Mark',
                marked: 'Marked',
                studyMode: 'Study Mode',
                quizMode: 'Quiz Mode',
                reviewMode: 'Review Errors',
                question: 'Question',
                total: 'Total',
                correct_answers: 'Correct',
                accuracy: 'Accuracy',
                multiple_choice_hint: 'Multiple choice question - Select all correct answers'
            }
        };
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || this.translations.fr[key] || key;
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateInterface();
    }

    updateInterface() {
        // Mettre à jour tous les textes de l'interface
        document.querySelector('.stat-label[for="currentQuestion"]') && (document.querySelector('.stat-label').textContent = this.getTranslation('question'));
        
        // Mettre à jour les boutons
        if (this.elements.showAnswerBtn && !this.isAnswerShown) {
            this.elements.showAnswerBtn.innerHTML = `<i class="fas fa-eye"></i> ${this.getTranslation('showAnswer')}`;
        }
        if (this.elements.correctBtn) {
            this.elements.correctBtn.innerHTML = `<i class="fas fa-check"></i> ${this.getTranslation('correct')}`;
        }
        if (this.elements.incorrectBtn) {
            this.elements.incorrectBtn.innerHTML = `<i class="fas fa-times"></i> ${this.getTranslation('incorrect')}`;
        }
        if (this.elements.nextBtn) {
            this.elements.nextBtn.innerHTML = `<i class="fas fa-arrow-right"></i> ${this.getTranslation('next')}`;
        }
        if (this.elements.shuffleBtn) {
            this.elements.shuffleBtn.innerHTML = `<i class="fas fa-random"></i> ${this.getTranslation('shuffle')}`;
        }
        if (this.elements.resetBtn) {
            this.elements.resetBtn.innerHTML = `<i class="fas fa-redo"></i> ${this.getTranslation('restart')}`;
        }
        
        this.updateMarkStatus();
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation de l\'application...');
    window.flashcards = new AWSFlashcards();
});

// Debug utilities
window.debugFlashcards = {
    skipToQuestion: (index) => {
        if (window.flashcards) {
            window.flashcards.currentQuestionIndex = index;
            window.flashcards.displayQuestion();
        }
    },
    
    showStats: () => {
        if (window.flashcards) {
            console.log('Session Stats:', window.flashcards.sessionStats);
            console.log('Marked Questions:', Array.from(window.flashcards.markedQuestions));
            console.log('Incorrect Questions:', Array.from(window.flashcards.incorrectQuestions));
        }
    }
};