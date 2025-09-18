// Assignment detail page with submission functionality
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssignments } from '../contexts/AssignmentsContext';

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const { currentUser, logout } = useAuth();
  const { updateAssignmentStatus, addSubmission } = useAssignments();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  // Drag & Drop state for interactive assignments
  const [ddAnswers, setDdAnswers] = useState({}); // {index: token}
  const [ddScore, setDdScore] = useState(null);
  const [ddShowResults, setDdShowResults] = useState(false);
  const [ddTexts, setDdTexts] = useState({}); // optional free-text per sentence for certain tasks
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({}); // { [qid]: value | {matchIndex: token} }
  const [quizScore, setQuizScore] = useState(null);
  const [quizShowResults, setQuizShowResults] = useState(false);
  // Optional audio support for quiz-type assignments
  const audioRef = useRef(null);
  const [audioPlays, setAudioPlays] = useState(0);

  // Mock assignment data
  const assignmentData = {
    'essay-future-goals': {
      id: 'essay-future-goals',
      title: 'Essay: My Future Goals',
      description: 'Write a 500-word essay about your future aspirations and how learning English will help you achieve them.',
      instructions: [
        'Write between 450-550 words',
        'Include an introduction, body paragraphs, and conclusion',
        'Use proper grammar and sentence structure',
        'Include specific examples and personal experiences',
        'Proofread your work before submission'
      ],
      dueDate: '2024-01-20',
      maxScore: 100,
      submissionType: 'text',
      status: 'not-started'
    },
    // Grammar Assignment 1: Linking words quiz
    'grammar-assignment-1': {
      id: 'grammar-assignment-1',
      title: 'Task 1: Linking Words Quiz',
      description: 'Listen to the audio and answer the questions about linking words (connectors).',
      instructions: [
        'Play the audio and read each question carefully.',
        'Answer all questions. Some items are multiple choice, fill-in-the-blank, matching, or true/false.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-05',
      maxScore: 10,
      submissionType: 'quiz',
      status: 'not-started',
      audioSrc: '/grammar4.mpeg',
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          prompt: 'Linking words are also known as:',
          options: ['Verbs', 'Adjectives', 'Connectors', 'Pronouns'],
          correctIndex: 2
        },
        {
          id: 'q2',
          type: 'fill',
          prompt: 'The new system is faster. ______, it is more reliable.',
          accept: ['moreover', 'furthermore']
        },
        {
          id: 'q3',
          type: 'match',
          prompt: 'Match the linking word with its correct function:',
          items: ['However,', 'For example,', 'Finally,', 'Therefore', 'In conclusion'],
          functionBank: [
            { key: 'a', text: 'Summarising' },
            { key: 'b', text: 'Cause & effect' },
            { key: 'c', text: '' },
            { key: 'd', text: 'Giving examples' },
            { key: 'e', text: 'Sequencing' },
            { key: 'f', text: 'Contrasting ideas' }
          ],
          // answers by index 0..4 -> key
          answers: ['f', 'd', 'e', 'b', 'a']
        },
        {
          id: 'q4',
          type: 'truefalse',
          prompt: '“Linking words should always be placed at the end of a sentence.”',
          correct: false
        },
        {
          id: 'q5',
          type: 'mcq',
          prompt: 'Which category does the word “consequently” belong to?',
          options: ['Adding information', 'Sequencing', 'Cause & effect', 'Summarising'],
          correctIndex: 2
        },
        {
          id: 'q6',
          type: 'fill',
          prompt: 'Several platforms, ______ Google Meet and Zoom, support online collaboration.',
          accept: ['such as']
        },
        {
          id: 'q7',
          type: 'mcq',
          prompt: 'Which sequence of connectors is best for organising a presentation?',
          options: [
            'Then – However – But – Anyway',
            'First of all – Next – Moreover – Finally',
            'Finally – Next – Moreover – First of all',
            'However – Moreover – For example – In short'
          ],
          correctIndex: 1
        },
        {
          id: 'q8',
          type: 'truefalse',
          prompt: 'Using varied connectors makes a presentation more engaging.',
          correct: true
        },
        {
          id: 'q9',
          type: 'fill',
          prompt: 'The team missed the deadline. ______, the project was delayed.',
          accept: ['as a result', 'therefore']
        },
        {
          id: 'q10',
          type: 'mcq',
          prompt: 'Which of the following is not a summarising connector?',
          options: ['In conclusion', 'To sum up', 'Overall', 'On the other hand'],
          correctIndex: 3
        }
      ]
    },
    // Business English Assignment 2: Dialogue completion (dragdrop)
    'business-assignment-2': {
      id: 'business-assignment-2',
      title: 'Task 2: Complete the Dialogue',
      description: 'Complete the dialogue using the negotiation phrases from the box by dragging them into the blanks.',
      instructions: [
        'Drag each phrase from the word bank into the correct blank.',
        'Each phrase is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-20',
      maxScore: 4,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: [
        'I understand your point, but we might face challenges with…',
        'What if we tried this approach instead?',
        'Can we agree to move forward with this plan?',
        'Just to clarify, you’re suggesting…?'
      ],
      sentences: [
        { text: 'Alex: We need to deliver the new feature by Friday, or the client will be unhappy.\nRiya: __________ (1) We might need an extra day for testing.', answer: 'I understand your point, but we might face challenges with…' },
        { text: 'Alex: Okay, but we can’t delay the release. __________ (2) extending the deadline by one day?', answer: 'Can we agree to move forward with this plan?' },
        { text: 'Riya: That could work. __________ (3) keeping the current deadline but prioritizing the most critical features?', answer: 'What if we tried this approach instead?' },
        { text: 'Alex: Yes, that makes sense. __________ (4) that we focus on the priority features first?', answer: 'Just to clarify, you’re suggesting…?' }
      ]
    },
    // Business English Assignment 3: Video upload (final)
    'business-assignment-3': {
      id: 'business-assignment-3',
      title: 'Task 1: Technical Presentation Practice (Video)',
      description: 'Prepare and deliver a 3-minute short technical presentation on a topic of your choice. Record your presentation as a video and upload the file for submission.',
      instructions: [
        'Record a 3-minute video presenting a technical topic of your choice.',
        'Speak clearly, structure your talk (intro → main points → conclusion), and use signposting.',
        'Drag and drop your video below or click to browse.',
        'Accepted formats: MP4, WEBM, MOV. Max recommended size 200MB.'
      ],
      dueDate: '2025-11-30',
      maxScore: 100,
      submissionType: 'video',
      status: 'not-started'
    },
    // Business English Assignment 1: Matching table
    'business-assignment-1': {
      id: 'business-assignment-1',
      title: 'Task 1: Match Negotiation Phrases',
      description: 'Match the negotiation phrase (Column A) with its function (Column B). Drag the function labels (A–F) into the matching rows.',
      instructions: [
        'Drag each function label (A–F) from the word bank into the correct phrase row.',
        'Each label is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-10',
      maxScore: 6,
      submissionType: 'match',
      status: 'not-started',
      phrases: [
        '“Let’s discuss how we can work this out.”',
        '“What if we tried this approach instead?”',
        '“That sounds reasonable, but…”',
        '“I understand your point, but we might face challenges with…”',
        '“Just to clarify, you’re suggesting…?”',
        '“Can we agree to move forward with this plan?”'
      ],
      functions: [
        { key: 'A', text: 'Opening the negotiation' },
        { key: 'B', text: 'Proposing an alternative solution' },
        { key: 'C', text: 'Expressing agreement or partial agreement' },
        { key: 'D', text: 'Expressing polite disagreement' },
        { key: 'E', text: 'Clarifying understanding' },
        { key: 'F', text: 'Closing the negotiation' }
      ],
      answers: ['A','B','C','D','E','F']
    },
    'grammar-exercise-3': {
      id: 'grammar-exercise-3',
      title: 'Grammar Exercise Set 3',
      description: 'Complete exercises on past tense usage with various scenarios.',
      instructions: [
        'Download the exercise PDF',
        'Complete all 20 questions',
        'Upload your completed work as PDF or image',
        'Show your work for partial credit'
      ],
      dueDate: '2024-01-18',
      maxScore: 50,
      submissionType: 'file',
      status: 'not-started'
    },
    'vocabulary-assignment-1': {
      id: 'vocabulary-assignment-1',
      title: 'Task 1: Academic Vocabulary Practice',
      description: 'Complete exercises on academic vocabulary usage and context.',
      instructions: [
        'Review the academic vocabulary terms from Lesson 1',
        'Complete the vocabulary matching exercise',
        'Write example sentences using each term'
      ],
      dueDate: '2025-10-15',
      maxScore: 25,
      submissionType: 'text',
      status: 'not-started'
    },
    'vocab-assignment-1': {
      id: 'vocab-assignment-1',
      title: 'Task 1: Workplace Jargon — Drag & Drop',
      description: 'Complete each sentence with the correct word from the box by dragging it into the blank.',
      instructions: [
        'Drag each word from the word bank into the correct blank.',
        'Each word is used exactly once.',
        'Click a placed word to remove it back to the bank if needed.',
        'Submit to check your score.'
      ],
      dueDate: '2025-10-31',
      maxScore: 11,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: [
        'bottleneck',
        'bandwidth',
        'blow-by-blow',
        'stand-up',
        'back to the drawing board',
        'onboarding',
        'go-to-market',
        'sprint',
        'black economy',
        'sync-up',
        'backlog'
      ],
      sentences: [
        {
          text: 'The testing phase has become a __________, slowing down the release schedule.',
          answer: 'bottleneck'
        },
        {
          text: 'We don’t have the __________ to take on an additional project this month.',
          answer: 'bandwidth'
        },
        {
          text: 'The product manager explained the new feature development in a __________ manner.',
          answer: 'blow-by-blow'
        },
        {
          text: 'The team met for their morning __________ to share updates and blockers.',
          answer: 'stand-up'
        },
        {
          text: 'After the client rejected the proposal, it was __________.',
          answer: 'back to the drawing board'
        },
        {
          text: 'Every new engineer goes through a two-week __________ process before joining their team.',
          answer: 'onboarding'
        },
        {
          text: 'The marketing team is preparing a __________ strategy for the new mobile app.',
          answer: 'go-to-market'
        },
        {
          text: 'Tasks that were not completed in the last __________ will be carried over.',
          answer: 'sprint'
        },
        {
          text: 'The finance department warns that illegal freelance work may contribute to the __________.',
          answer: 'black economy'
        },
        {
          text: 'Let’s have a quick __________ call to finalize the release plan.',
          answer: 'sync-up'
        },
        {
          text: 'The project manager checked the __________ to prioritize which tasks should be tackled first.',
          answer: 'backlog'
        }
      ]
    },
    'vocab-assignment-2': {
      id: 'vocab-assignment-2',
      title: 'Task 2: Workplace Jargon — Drag & Drop',
      description: 'Finish each sentence using your own ideas, making sure to use the given word correctly by dragging it into the blank.',
      instructions: [
        'Drag each word from the word bank into the correct blank.',
        'Each word is used exactly once.',
        'Use the sentence ending as a guide to complete it naturally once the correct term is placed.',
        'Submit to check your score.'
      ],
      dueDate: '2025-11-15',
      maxScore: 10,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: [
        'backlog',
        'bandwidth',
        'stand-up',
        'back to the drawing board',
        'onboarding',
        'bottleneck',
        'go-to-market',
        'blow-by-blow',
        'sprint',
        'sync-up'
      ],
      sentences: [
        { text: 'The __________ is full of pending bug fixes, so…', answer: 'backlog' },
        { text: 'Our team doesn’t have enough __________ this week, which means…', answer: 'bandwidth' },
        { text: 'During the daily __________, I mentioned that…', answer: 'stand-up' },
        { text: 'The developers had to go __________ because…', answer: 'back to the drawing board' },
        { text: 'The new hire’s __________ included…', answer: 'onboarding' },
        { text: 'A major __________ in our project is…', answer: 'bottleneck' },
        { text: 'The CEO presented the __________ plan to…', answer: 'go-to-market' },
        { text: 'After the detailed __________ explanation, everyone understood…', answer: 'blow-by-blow' },
        { text: 'In the last __________, our team managed to…', answer: 'sprint' },
        { text: 'We had a quick __________ before the client meeting to…', answer: 'sync-up' }
      ]
    }
    ,
    // Grammar Lesson 7 - Clarification Techniques
    'grammar-clarification-task-a': {
      id: 'grammar-clarification-task-a',
      title: 'Task A: Match Technique → Example',
      description: 'Match each clarification technique with the correct example sentence.',
      instructions: ['Drag the correct letter (A–F) to each technique.'],
      dueDate: '2025-11-26',
      maxScore: 6,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'g7a',
          type: 'match',
          prompt: 'Match the technique with the example',
          items: [
            'Indirect Question',
            'Paraphrasing to Confirm',
            'Softening Phrase',
            'Asking for Examples',
            'Checking Key Details',
            'Summarizing'
          ],
          functionBank: [
            { key: 'a', text: 'So, the plan is to release the patch on Friday after testing, correct?' },
            { key: 'b', text: 'I’m sorry, I didn’t quite catch the version number you mentioned.' },
            { key: 'c', text: 'Could you show me an example of the error message users are seeing?' },
            { key: 'd', text: 'Just to confirm, we are deploying on AWS, not Azure?' },
            { key: 'e', text: 'If I understand correctly, you want us to refactor the code before adding new features, right?' },
            { key: 'f', text: 'Could you explain what you mean by “scaling the architecture”?' }
          ],
          // Expected mapping by item index -> key
          answers: ['f','e','b','c','d','a']
        }
      ]
    },
    'grammar-clarification-task-b': {
      id: 'grammar-clarification-task-b',
      title: 'Task B: Fill in the Clarification Phrase',
      description: 'Complete the sentences with a suitable clarification phrase from the list.',
      instructions: ['Answers are case-insensitive.'],
      dueDate: '2025-11-27',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'g7b1', type: 'fill', prompt: 'I’m not sure I understood. __________ that again, please?', accept: ['could you explain','Could you explain'] },
        { id: 'g7b2', type: 'fill', prompt: 'Just to confirm, __________ the sprint demo on Thursday?', accept: ['is the','Is the'] },
        { id: 'g7b3', type: 'fill', prompt: '__________ give me an example of a user scenario for this feature?', accept: ['can you','Can you'] },
        { id: 'g7b4', type: 'fill', prompt: 'So, you’re saying the bug only appears when users __________ multiple tabs, right?', accept: ['open','Open'] },
        { id: 'g7b5', type: 'fill', prompt: 'I’m sorry, I __________ catch the last point about the GitHub branch.', accept: ['didn’t','did not','Didn’t','Did not'] }
      ]
    },
    'grammar-clarification-task-c': {
      id: 'grammar-clarification-task-c',
      title: 'Task C: Vocabulary Match',
      description: 'Match the term with its meaning from the reading.',
      instructions: ['Drag the correct letter (a–d) to each term.'],
      dueDate: '2025-11-28',
      maxScore: 4,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'g7c',
          type: 'match',
          prompt: 'Match the word/phrase with its meaning',
          items: ['Deployment pipeline','Logs','Permission-related error','Root cause'],
          functionBank: [
            { key: 'a', text: 'Messages that record how a system or software runs.' },
            { key: 'b', text: 'The fundamental reason behind a problem.' },
            { key: 'c', text: 'The sequence of automated steps to release software.' },
            { key: 'd', text: 'An error caused by lack of access rights.' }
          ],
          answers: ['c','a','d','b']
        }
      ]
    },
    'grammar-clarification-task-d': {
      id: 'grammar-clarification-task-d',
      title: 'Task D: Complete with the Correct Word',
      description: 'Fill in the blanks with the correct word from the box.',
      instructions: ['Word bank: logs, inconsistent, sprint, clarify, blockers'],
      dueDate: '2025-11-29',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'g7d1', type: 'fill', prompt: 'The QA team asked the developer to __________ what “slow” meant in the report.', accept: ['clarify'] },
        { id: 'g7d2', type: 'fill', prompt: 'The developer explained that the API was __________ because it sometimes returned errors.', accept: ['inconsistent'] },
        { id: 'g7d3', type: 'fill', prompt: 'In the meeting, the manager asked if anyone had any __________.', accept: ['blockers'] },
        { id: 'g7d4', type: 'fill', prompt: 'The team checked the error __________ to understand the failure.', accept: ['logs'] },
        { id: 'g7d5', type: 'fill', prompt: 'Ravi wanted to know if the task deadline was this week or this __________.', accept: ['sprint'] }
      ]
    }
    ,
    // Advanced Vocabulary - Lesson 3: Cross-Cultural Communication Phrases
    'av-crosscultural-task-1': {
      id: 'av-crosscultural-task-1',
      title: 'Task 1: Match Phrase → Meaning',
      description: 'Match each cross-cultural communication phrase to its meaning.',
      instructions: ['Drag the correct letter (A–G) for each phrase.'],
      dueDate: '2025-10-17',
      maxScore: 7,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'cc1',
          type: 'match',
          prompt: 'Match Column A (phrases) to Column B (meanings).',
          items: [
            'Could you please clarify what you mean?',
            'Let’s make sure we’re on the same page.',
            'I understand your perspective, but in my culture we usually…',
            'How is this usually handled in your team/country?',
            'I appreciate your patience with me as I learn.',
            'Would you prefer a more direct or detailed explanation?',
            'Let’s find a middle ground that works for both of us.'
          ],
          functionBank: [
            { key: 'A', text: 'Asking for cultural practices or norms' },
            { key: 'B', text: 'Request for clarification' },
            { key: 'C', text: 'Acknowledging differences respectfully' },
            { key: 'D', text: 'Expressing gratitude while adapting' },
            { key: 'E', text: 'Checking if everyone has the same understanding' },
            { key: 'F', text: 'Offering flexibility in communication style' },
            { key: 'G', text: 'Proposing compromise' }
          ],
          answers: ['B','E','C','A','D','F','G']
        }
      ]
    },
    // Advanced Vocabulary - Lesson 4: Customer Service Phrases (Video Role-play)
    'av-customer-task-1': {
      id: 'av-customer-task-1',
      title: 'Task 1: Role-play Recording (Video)',
      description: 'Choose a role and record a 3–5 minute interaction using at least five lesson phrases. Upload your recording.',
      instructions: [
        'Choose one role: customer/client or service representative.',
        'Use at least five phrases from the lesson and demonstrate politeness and professionalism.',
        'Record 3–5 minutes; accepted formats: MP4, WEBM, MOV (≤ 200MB).',
        'Evaluation (10 marks): Use of phrases (4), Politeness (3), Clarity (2), Engagement (1).'
      ],
      dueDate: '2025-10-18',
      maxScore: 10,
      submissionType: 'video',
      status: 'not-started'
    },
    // Advanced Vocabulary - Lesson 5: Collaboration & Teamwork
    'av-collab-task-1': {
      id: 'av-collab-task-1',
      title: 'Task 1: Match Terms → Definitions',
      description: 'Match the teamwork terms with their correct definitions.',
      instructions: ['Drag the correct letter (A–E) to each term.'],
      dueDate: '2025-10-19',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'ctm',
          type: 'match',
          prompt: 'Match the terms to their definitions.',
          items: ['Sprint','Blocker','Code Review','Cross-Functional Team','Stand-up Meeting'],
          functionBank: [
            { key: 'A', text: 'Daily meeting to share progress and blockers' },
            { key: 'B', text: 'Obstacle that prevents progress' },
            { key: 'C', text: 'Short, focused time-boxed work period' },
            { key: 'D', text: 'Reviewing peers’ code for quality' },
            { key: 'E', text: 'Team made of members with different skill sets' }
          ],
          answers: ['C','B','D','E','A']
        }
      ]
    },
    'av-collab-task-2': {
      id: 'av-collab-task-2',
      title: 'Task 2: Fill in the Blanks',
      description: 'Complete sentences using teamwork vocabulary.',
      instructions: ['Type the word(s) that correctly complete each sentence.'],
      dueDate: '2025-10-20',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'cf1', type: 'fill', prompt: 'In Agile, work is divided into short cycles called __________.', accept: ['sprints','sprint'] },
        { id: 'cf2', type: 'fill', prompt: 'A __________ meeting helps the team stay aligned daily.', accept: ['stand-up meeting','stand up meeting','daily stand-up','daily stand up'] },
        { id: 'cf3', type: 'fill', prompt: 'Sharing knowledge openly is essential for building team __________.', accept: ['synergy'] },
        { id: 'cf4', type: 'fill', prompt: 'Tools like Jira and Trello are examples of __________ tools.', accept: ['collaboration'] },
        { id: 'cf5', type: 'fill', prompt: 'When two developers work together at one computer, it is called __________ programming.', accept: ['pair'] }
      ]
    },
    'av-collab-task-3': {
      id: 'av-collab-task-3',
      title: 'Task 3: Teamwork – MCQ',
      description: 'Answer the following questions about teamwork practices.',
      instructions: ['Select the best answer for each question.'],
      dueDate: '2025-10-21',
      maxScore: 2,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'cm1',
          type: 'mcq',
          prompt: 'Which of the following BEST represents teamwork?',
          options: ['Working alone on tasks without communicating','Blaming others for bugs','Supporting peers and sharing knowledge','Ignoring blockers during stand-ups'],
          correctIndex: 2
        },
        {
          id: 'cm2',
          type: 'mcq',
          prompt: 'Which tool is MOST commonly used for task tracking in agile teamwork?',
          options: ['VLC Media Player','Jira','Photoshop','Windows Media Player'],
          correctIndex: 1
        }
      ]
    },
    // Advanced Vocabulary - Lesson 7: Persuasion Phrases
    'av-persuasion-task-1': {
      id: 'av-persuasion-task-1',
      title: 'Task 1: Persuasion – MCQ + Fill',
      description: 'Answer MCQs and complete sentences using appropriate persuasion phrases.',
      instructions: ['Answer all questions. Use phrases from the lesson for fill-ins.'],
      dueDate: '2025-10-25',
      maxScore: 12,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        // Part A – MCQ (5 marks total as per prompt weight; here scored per question)
        { id: 'pp1', type: 'mcq', prompt: 'Why is persuasion an important skill in technical and business contexts?', options: ['Because it allows professionals to give orders without explanation','Because it helps professionals influence decisions and gain support for ideas','Because it avoids communication in the workplace','Because it replaces technical knowledge'], correctIndex: 1 },
        { id: 'pp2', type: 'mcq', prompt: 'Which are examples of persuasion in workplace situations?', options: ['(i) and (ii) only','(ii) and (iii) only','(i), (ii), and (iv) only','(i), (iii), and (iv) only'], correctIndex: 2 },
        // Part B – Fill (sentences)
        { id: 'ppb1', type: 'fill', prompt: 'A project manager to team: “________ we adopt cloud storage, as it offers stronger data security.”', accept: ['i strongly recommend','I strongly recommend'] },
        { id: 'ppb2', type: 'fill', prompt: 'An engineer to management: “________ allocating funds for training on the new software tool.”', accept: ['it would be beneficial if','It would be beneficial if'] },
        { id: 'ppb3', type: 'fill', prompt: 'An engineer to management: “________ it will improve efficiency in the long run.”', accept: ['i believe this is the best approach because','I believe this is the best approach because'] },
        { id: 'ppb4', type: 'fill', prompt: 'A team leader to colleagues: “________ we develop a backup plan for the client presentation.”', accept: ['may i suggest','May I suggest'] },
        { id: 'ppb5', type: 'fill', prompt: 'A team leader to colleagues: “________ we avoid any last-minute risks and impress the client.”', accept: ['to ensure success, we should','To ensure success, we should'] },
        // Task 3 – MCQ
        { id: 'pp3', type: 'mcq', prompt: 'Which email shows the BEST use of persuasion phrases?', options: ['“We are late on the project. You must approve overtime.”','“The project is behind schedule. I strongly recommend approving overtime because it will help us meet the deadline. This will enable us to deliver on time.”','“The project is late, but it’s not my fault.”','“The project is behind, and I hope someone fixes it.”'], correctIndex: 1 },
        { id: 'pp4', type: 'mcq', prompt: 'Fill in the blanks: “________ we schedule short daily check-ins. We can quickly identify problems and prevent further delays.”', options: ['I’d appreciate your support on this / This will enable us to','May I suggest / This will enable us to','To ensure success, we should / I strongly recommend','I believe this is the best approach because / May I suggest'], correctIndex: 1 }
      ]
    }
    ,
    // Business English - Lesson 2: Stand-up Meetings
    'be-standup-task-1': {
      id: 'be-standup-task-1',
      title: 'Task 1: Match Stand-up Qs ↔ Answers',
      description: 'Match the stand-up question (1–3) with the correct type of answer (a–f).',
      instructions: [
        'Drag each letter (a–f) onto the matching question.',
        'Some questions have two valid answers; place both letters in order separated by a comma (use the drag-and-drop for each row).'
      ],
      dueDate: '2025-11-01',
      maxScore: 3,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'suq1',
          type: 'match',
          prompt: 'Match the stand-up questions with appropriate answers',
          items: [
            'What did you do yesterday?',
            'What are you doing today?',
            'Do you have any blockers?'
          ],
          functionBank: [
            { key: 'a', text: 'I am preparing the client presentation.' },
            { key: 'b', text: 'I completed the testing for Module A.' },
            { key: 'c', text: 'Yes, I’m waiting for data from the analytics team.' },
            { key: 'd', text: 'I am reviewing yesterday’s meeting notes.' },
            { key: 'e', text: 'No, I don’t have any blockers today.' },
            { key: 'f', text: 'Yesterday, I finished writing the user manual.' }
          ],
          // Using first of each pair from the answer key (b/f), (a/d), (c/e)
          answers: ['b', 'a', 'c']
        }
      ]
    },
    'be-standup-task-2': {
      id: 'be-standup-task-2',
      title: 'Task 2: Verb Forms in Stand-ups',
      description: 'Complete the sentences with the correct verb form (Past Simple, Present Continuous, Present Simple).',
      instructions: [
        'Type the correct verb phrase into each blank.',
        'Answers are case-insensitive; small variations like contractions are accepted where applicable.'
      ],
      dueDate: '2025-11-02',
      maxScore: 10,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'su2q1', type: 'fill', prompt: 'Yesterday, I __________ (work) on fixing the login issue.', accept: ['worked'] },
        { id: 'su2q2', type: 'fill', prompt: 'Today, I __________ (check) the system performance.', accept: ['am checking'] },
        { id: 'su2q3', type: 'fill', prompt: 'I __________ (not / have) any blockers at the moment.', accept: ['do not have', "don't have"] },
        { id: 'su2q4', type: 'fill', prompt: 'Yesterday, we __________ (complete) the draft report for the project.', accept: ['completed'] },
        { id: 'su2q5', type: 'fill', prompt: 'Today, I __________ (prepare) slides for the client presentation.', accept: ['am preparing'] },
        { id: 'su2q6', type: 'fill', prompt: 'I __________ (wait) for feedback from the design team.', accept: ['am waiting'] },
        { id: 'su2q7', type: 'fill', prompt: 'Yesterday, my team __________ (update) the project timeline.', accept: ['updated'] },
        { id: 'su2q8', type: 'fill', prompt: 'Right now, I __________ (review) the code changes from yesterday.', accept: ['am reviewing'] },
        { id: 'su2q9', type: 'fill', prompt: 'At the moment, I __________ (not / face) any problems with my tasks.', accept: ['am not facing'] },
        { id: 'su2q10', type: 'fill', prompt: 'Yesterday, I __________ (attend) a meeting with the manager.', accept: ['attended'] }
      ]
    },
    'be-standup-task-3': {
      id: 'be-standup-task-3',
      title: 'Task 3: Vocabulary Matching',
      description: 'Match the word/phrase with its meaning from the dialogue.',
      instructions: [
        'Drag the correct definition letter to each word.'
      ],
      dueDate: '2025-11-03',
      maxScore: 6,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'su3m1',
          type: 'match',
          prompt: 'Match the items',
          items: ['proposal', 'blocker', 'draft', 'performance', 'coordinate', 'confirm'],
          functionBank: [
            { key: 'a', text: 'An obstacle or problem that delays work' },
            { key: 'b', text: 'The speed/quality at which something works' },
            { key: 'c', text: 'An early version of a document' },
            { key: 'd', text: 'A written plan or suggestion' },
            { key: 'e', text: 'To work together with others to organize tasks' },
            { key: 'f', text: 'To verify or approve something officially' }
          ],
          answers: ['d','a','c','b','e','f']
        }
      ]
    },
    'be-standup-task-4': {
      id: 'be-standup-task-4',
      title: 'Task 4: Reading – True/False',
      description: 'Read the stand-up dialogue and mark statements as True or False.',
      instructions: [
        'Answer each statement based on the dialogue provided in the lesson.'
      ],
      dueDate: '2025-11-04',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'su4q1', type: 'truefalse', prompt: 'Sarah is facing a blocker today.', correct: false },
        { id: 'su4q2', type: 'truefalse', prompt: 'Ravi worked on testing the system yesterday.', correct: false },
        { id: 'su4q3', type: 'truefalse', prompt: 'Mina is discussing the user manual with the design team today.', correct: true },
        { id: 'su4q4', type: 'truefalse', prompt: 'Alex is waiting for confirmation about the release date.', correct: true },
        { id: 'su4q5', type: 'truefalse', prompt: 'The manager asks questions during the stand-up.', correct: false }
      ]
    },

    // Business English - Lesson 4: Business Etiquette
    'be-etiquette-task-1': {
      id: 'be-etiquette-task-1',
      title: 'Task 1: Etiquette – MCQ',
      description: 'Choose the best option for each question.',
      instructions: [
        'Select one option per question.'
      ],
      dueDate: '2025-11-08',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'be1', type: 'mcq', prompt: 'Which phrase is appropriate to confirm your attendance at a meeting?', options: ['I think I might come at some point.','I will join the meeting promptly at 10 AM.','I’m not sure if I will be there.'], correctIndex: 1 },
        { id: 'be2', type: 'mcq', prompt: 'In an indirect culture, how would you politely suggest a change?', options: ['Fix the report now.','It might be helpful to review the report again before Friday.','The report is wrong.'], correctIndex: 1 },
        { id: 'be3', type: 'mcq', prompt: 'Which is a correct polite email closing?', options: ['See ya.','Best regards,','Bye bye.'], correctIndex: 1 },
        { id: 'be4', type: 'mcq', prompt: 'How can you politely ask to speak in a meeting?', options: ['Let me talk now.','May I add something here?','Stop talking, I want to speak.'], correctIndex: 1 },
        { id: 'be5', type: 'mcq', prompt: 'How to address a senior colleague in a hierarchical culture?', options: ['Hey, John.','Mr. Smith, could you please advise?','What’s up, boss?'], correctIndex: 1 }
      ]
    },
    'be-etiquette-task-2': {
      id: 'be-etiquette-task-2',
      title: 'Task 2: Etiquette – Fill in the Blanks',
      description: 'Complete the sentences using words from the box.',
      instructions: [
        'Use words: could, please, apologize, might, regard(s), appreciate',
        'Type the single word needed; capitalization is flexible.'
      ],
      dueDate: '2025-11-09',
      maxScore: 6,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'be6a', type: 'fill', prompt: 'I _______ for the delay due to technical issues.', accept: ['apologize','apologise'] },
        { id: 'be6b', type: 'fill', prompt: '_______ you send me the updated file by Friday?', accept: ['could'] },
        { id: 'be6c', type: 'fill', prompt: 'Thank you for your _______ and help.', accept: ['appreciation','appreciate'] },
        { id: 'be6d', type: 'fill', prompt: 'We _______ consider another approach to solve the problem.', accept: ['might'] },
        { id: 'be6e', type: 'fill', prompt: 'Best ________,', accept: ['regards','regard'] },
        { id: 'be6f', type: 'fill', prompt: '_______ you let me know if you have any questions?', accept: ['could'] }
      ]
    },
    'be-etiquette-task-3': {
      id: 'be-etiquette-task-3',
      title: 'Task 3: Phrase → Purpose (Match)',
      description: 'Match each phrase to its communicative purpose.',
      instructions: ['Drag the correct purpose letter (a–d) beside each phrase.'],
      dueDate: '2025-11-10',
      maxScore: 4,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'be7m',
          type: 'match',
          prompt: 'Match the phrase to its purpose',
          items: [
            '“I see it differently because…”',
            '“Thank you for your understanding.”',
            '“Please let me know if you need any clarification.”',
            '“I agree with your point.”'
          ],
          functionBank: [
            { key: 'a', text: 'Agreeing politely' },
            { key: 'b', text: 'Polite disagreement' },
            { key: 'c', text: 'Offering help or further communication' },
            { key: 'd', text: 'Expressing gratitude' }
          ],
          answers: ['b','d','c','a']
        }
      ]
    },
    'be-etiquette-task-4': {
      id: 'be-etiquette-task-4',
      title: 'Task 4: True or False',
      description: 'Decide if each statement is true or false.',
      instructions: ['Answer based on the etiquette content.'],
      dueDate: '2025-11-11',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'be8t1', type: 'truefalse', prompt: 'Interrupting during meetings is considered polite in all cultures.', correct: false },
        { id: 'be8t2', type: 'truefalse', prompt: 'Direct cultures prefer explicit and clear communication.', correct: true },
        { id: 'be8t3', type: 'truefalse', prompt: '“Would you mind…” is a rude way to ask for help.', correct: false },
        { id: 'be8t4', type: 'truefalse', prompt: 'Using first names is acceptable in all cultures regardless of hierarchy.', correct: false },
        { id: 'be8t5', type: 'truefalse', prompt: 'Eye contact always shows confidence and respect in every culture.', correct: false }
      ]
    },

    // Business English - Lesson 6: Report Writing
    'be-reportwriting-task-1': {
      id: 'be-reportwriting-task-1',
      title: 'Task 1: Report Writing – MCQ',
      description: 'Select the correct answers about report writing.',
      instructions: ['Select one answer for each question.'],
      dueDate: '2025-11-22',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'rw1', type: 'mcq', prompt: 'The main purpose of a technical report is:', options: ['To entertain the reader','To provide structured information for decision-making','To tell personal stories','To replace coding'], correctIndex: 1 },
        { id: 'rw2', type: 'mcq', prompt: 'Which section of a report explains why the report was written?', options: ['Introduction','Findings','Recommendations','Title page'], correctIndex: 0 },
        { id: 'rw3', type: 'mcq', prompt: 'Which of the following is NOT a feature of effective report writing?', options: ['Clarity','Objectivity','Professional tone','Storytelling with emotions'], correctIndex: 3 },
        { id: 'rw4', type: 'mcq', prompt: 'For a software engineer, which is the BEST example of report writing?', options: ['A project bug report with findings and recommendations','A casual text message to a colleague','A creative short story','A personal blog post'], correctIndex: 0 },
        { id: 'rw5', type: 'mcq', prompt: 'Which section of a report usually suggests future action?', options: ['Introduction','Findings/Analysis','Recommendations/Conclusion','Background'], correctIndex: 2 }
      ]
    },
    'be-reportwriting-task-2': {
      id: 'be-reportwriting-task-2',
      title: 'Task 2: Report Writing – Fill in the Blanks',
      description: 'Complete the sentences with the correct terms.',
      instructions: ['Type the exact term (case-insensitive). Variants accepted where noted.'],
      dueDate: '2025-11-23',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'rwf1', type: 'fill', prompt: 'The ________ provides data, facts, and results from research or testing.', accept: ['findings','findings/analysis','analysis','findings and analysis'] },
        { id: 'rwf2', type: 'fill', prompt: 'The ________ suggests practical solutions or next steps.', accept: ['recommendations','conclusion','recommendations/conclusion'] },
        { id: 'rwf3', type: 'fill', prompt: 'A good report should always maintain a ________ and respectful tone.', accept: ['professional'] },
        { id: 'rwf4', type: 'fill', prompt: 'The ________ gives context to the issue being reported.', accept: ['background','problem statement','background/problem statement'] },
        { id: 'rwf5', type: 'fill', prompt: 'Reports should be written with ________ to ensure non-technical readers understand.', accept: ['clarity'] }
      ]
    },
    'be-reportwriting-task-3': {
      id: 'be-reportwriting-task-3',
      title: 'Task 3: Report Writing – True/False',
      description: 'Mark each statement as True or False.',
      instructions: ['Select True or False for each item.'],
      dueDate: '2025-11-24',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'rwt1', type: 'truefalse', prompt: 'Reports should use headings and a logical flow.', correct: true },
        { id: 'rwt2', type: 'truefalse', prompt: 'Reports should include personal opinions without evidence.', correct: false },
        { id: 'rwt3', type: 'truefalse', prompt: 'A software testing report is an example of business/technical reporting.', correct: true },
        { id: 'rwt4', type: 'truefalse', prompt: 'Conciseness means using long, detailed paragraphs.', correct: false },
        { id: 'rwt5', type: 'truefalse', prompt: 'Recommendations are optional in all reports.', correct: false }
      ]
    },

    // Business English - Lesson 1: Writing clear and concise emails
    'be-email-task-1': {
      id: 'be-email-task-1',
      title: 'Task 1: Email Clarity – True/False',
      description: 'Decide if each statement is True or False.',
      instructions: ['Select True or False for each item.'],
      dueDate: '2025-11-12',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'em1', type: 'truefalse', prompt: 'A clear subject line should summarize the purpose of the email.', correct: true },
        { id: 'em2', type: 'truefalse', prompt: 'Using long, complex sentences makes an email more professional.', correct: false },
        { id: 'em3', type: 'truefalse', prompt: 'Bullet points can help make an email easier to read.', correct: true },
        { id: 'em4', type: 'truefalse', prompt: 'It is acceptable to use informal abbreviations like “u” and “btw” in professional emails.', correct: false },
        { id: 'em5', type: 'truefalse', prompt: 'Keeping emails short and to the point saves the reader’s time.', correct: true }
      ]
    },
    'be-email-task-2': {
      id: 'be-email-task-2',
      title: 'Task 2: Email Essentials – MCQ',
      description: 'Choose the best option for clarity and professionalism.',
      instructions: ['Select one option per question.'],
      dueDate: '2025-11-13',
      maxScore: 4,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'emc1', type: 'mcq', prompt: 'Which subject line is the clearest?', options: ['Meeting','Budget Meeting – Friday, 2 PM','Some updates','Important'], correctIndex: 1 },
        { id: 'emc2', type: 'mcq', prompt: 'Which opening is most appropriate for a business email?', options: ["Hey, what’s up?",'Good morning, I hope this message finds you well.','Yo, how are things?','Sup'], correctIndex: 1 },
        { id: 'emc3', type: 'mcq', prompt: 'Which sentence is the most concise?', options: ['I am just writing this email to let you know that we might have a meeting tomorrow, if that’s okay with you.','Could we meet tomorrow to discuss the project?','I was wondering if, maybe, you have some free time tomorrow so we can possibly talk about the project.','There’s a chance that we might, at some point, consider meeting tomorrow.'], correctIndex: 1 },
        { id: 'emc4', type: 'mcq', prompt: 'Which closing is most suitable for a professional email?', options: ['Bye','Later','Best regards,','See ya'], correctIndex: 2 }
      ]
    },

    // Business English - Lesson 5: Teamwork and leadership communication
    'be-teamwork-task-1': {
      id: 'be-teamwork-task-1',
      title: 'Task 1: Leadership Communication – Complete the Sentences',
      description: 'Choose the correct letter from the box to complete each sentence.',
      instructions: ['Drag the correct letter (A–E) to complete each scenario.'],
      dueDate: '2025-11-16',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'tw1',
          type: 'match',
          prompt: 'Match each leadership scenario to the correct function (A–E).',
          items: [
            'When you want to encourage collaboration',
            'When you delegate responsibility to someone',
            'When you show recognition to your team',
            'When you invite input from others',
            'When you redirect the team to stay positive'
          ],
          functionBank: [
            { key: 'A', text: 'Encouraging collaboration' },
            { key: 'B', text: 'Delegating responsibility' },
            { key: 'C', text: 'Recognizing achievement' },
            { key: 'D', text: 'Inviting input' },
            { key: 'E', text: 'Promoting a positive mindset' }
          ],
          answers: ['A','B','C','D','E']
        }
      ]
    },
    'be-teamwork-task-2': {
      id: 'be-teamwork-task-2',
      title: 'Task 2: Phrase → Purpose (Leadership)',
      description: 'Match the leadership phrase to the correct purpose.',
      instructions: ['Drag the correct purpose key (1–4) beside each phrase.'],
      dueDate: '2025-11-17',
      maxScore: 4,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        {
          id: 'tw2',
          type: 'match',
          prompt: 'Match the phrase to its purpose',
          items: [
            '“Great job on completing the project ahead of time.”',
            '“Can you handle the presentation for tomorrow’s meeting?”',
            '“Let’s brainstorm some ideas as a team.”',
            '“We all need to stick to the deadline.”'
          ],
          functionBank: [
            { key: '1', text: 'Delegating responsibility' },
            { key: '2', text: 'Motivating and recognizing achievement' },
            { key: '3', text: 'Encouraging teamwork and idea-sharing' },
            { key: '4', text: 'Reminding the team about commitment' }
          ],
          answers: ['2','1','3','4']
        }
      ]
    },

    // Business English - Lesson 7: Negotiation
    'be-negotiation-task-1': {
      id: 'be-negotiation-task-1',
      title: 'Task 1: Match Negotiation Phrases',
      description: 'Match the negotiation phrase (Column A) with its function (Column B).',
      instructions: [
        'Drag each function label (A–F) from the word bank into the correct phrase row.',
        'Each label is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-11-18',
      maxScore: 6,
      submissionType: 'match',
      status: 'not-started',
      phrases: [
        '"Let\'s discuss how we can work this out."',
        '"What if we tried this approach instead?"',
        '"That sounds reasonable, but…"',
        '"I understand your point, but we might face challenges with…"',
        '"Just to clarify, you\'re suggesting…?"',
        '"Can we agree to move forward with this plan?"'
      ],
      functions: [
        { key: 'A', text: 'Opening the negotiation' },
        { key: 'B', text: 'Proposing an alternative solution' },
        { key: 'C', text: 'Expressing agreement or partial agreement' },
        { key: 'D', text: 'Expressing polite disagreement' },
        { key: 'E', text: 'Clarifying understanding' },
        { key: 'F', text: 'Closing the negotiation' }
      ],
      answers: ['A','B','C','D','E','F']
    },
    'be-negotiation-task-2': {
      id: 'be-negotiation-task-2',
      title: 'Task 2: Complete the Dialogue',
      description: 'Complete the dialogue using the negotiation phrases from the box by dragging them into the blanks.',
      instructions: [
        'Drag each phrase from the word bank into the correct blank.',
        'Each phrase is used exactly once.',
        'Submit to check your score.'
      ],
      dueDate: '2025-11-19',
      maxScore: 4,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: [
        'I understand your point, but we might face challenges with...',
        'What if we tried this approach instead?',
        'Can we agree to move forward with this plan?',
        'Just to clarify, you\'re suggesting...?'
      ],
      sentences: [
        { text: 'Alex: We need to deliver the new feature by Friday, or the client will be unhappy.\\nRiya: __________ (1) We might need an extra day for testing.', answer: 'I understand your point, but we might face challenges with...' },
        { text: 'Alex: Okay, but we can\'t delay the release. __________ (2) extending the deadline by one day?', answer: 'Can we agree to move forward with this plan?' },
        { text: 'Riya: That could work. __________ (3) keeping the current deadline but prioritizing the most critical features?', answer: 'What if we tried this approach instead?' },
        { text: 'Alex: Yes, that makes sense. __________ (4) that we focus on the priority features first?', answer: 'Just to clarify, you\'re suggesting...?' }
      ]
    },

    // Business English - Lesson 3: Presentations (Video submission)
    'be-presentations-task-1': {
      id: 'be-presentations-task-1',
      title: 'Task 1: 3-minute Technical Presentation (Video)',
      description: 'Prepare and deliver a 3-minute short technical presentation on a topic of your choice. Record your presentation as a video and upload the file for submission.',
      instructions: [
        'Record a ~3-minute video presenting a technical topic of your choice.',
        'Speak clearly, structure your talk (intro → main points → conclusion), and use signposting.',
        'Drag and drop your video below or click to browse. Accepted formats: MP4, WEBM, MOV. Max ~200MB.'
      ],
      dueDate: '2025-11-06',
      maxScore: 100,
      submissionType: 'video',
      status: 'not-started'
    },
    // Articles Lesson - Task 1: Fill with a/an/the/(no article)
    'articles-task-1': {
      id: 'articles-task-1',
      title: 'Task 1: Articles – Fill the Blanks',
      description: 'Fill each blank with a, an, the, or type "no article" if none is needed.',
      instructions: [
        'Type exactly one of: a, an, the, or no article (for zero article).',
        'Answers are case-insensitive.',
        'Submit to see your score.'
      ],
      dueDate: '2025-10-05',
      maxScore: 8,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'q1', type: 'fill', prompt: 'We found ___ error in the login module.', accept: ['an'] },
        { id: 'q2', type: 'fill', prompt: 'Please restart ___ server after the update.', accept: ['the'] },
        { id: 'q3', type: 'fill', prompt: '___ bugs reported yesterday are still unresolved.', accept: ['the'] },
        { id: 'q4', type: 'fill', prompt: 'I need ___ update on the testing status.', accept: ['an'] },
        { id: 'q5', type: 'fill', prompt: '___ information in the document is confidential.', accept: ['the'] },
        { id: 'q6', type: 'fill', prompt: 'He is ___ analyst for this project.', accept: ['an'] },
        { id: 'q7', type: 'fill', prompt: '___ software development requires thorough testing.', accept: ['no article'] },
        { id: 'q8', type: 'fill', prompt: 'Could you review ___ interface design?', accept: ['the'] }
      ]
    }
    ,
    // Articles Lesson - Task 2: Paragraph completion (articles only)
    'articles-task-2': {
      id: 'articles-task-2',
      title: 'Task 2: Articles – Paragraph Completion',
      description: 'Complete the engineer’s report by filling in the correct articles.',
      instructions: [
        'Type one of: a, an, the, or no article for each blank.',
        'Answers are case-insensitive.',
        'Submit to see your score.'
      ],
      dueDate: '2025-10-06',
      maxScore: 14,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'p1', type: 'fill', prompt: 'Today, we discussed ___ new feature that will improve user experience.', accept: ['a'] },
        { id: 'p2', type: 'fill', prompt: '___ feature requires ___ interface redesign and ___ update to ___ backend server. (first blank)', accept: ['the'] },
        { id: 'p3', type: 'fill', prompt: 'The feature requires ___ interface redesign and ___ update to ___ backend server. (second blank)', accept: ['an'] },
        { id: 'p4', type: 'fill', prompt: 'The feature requires an interface redesign and ___ update to ___ backend server. (third blank)', accept: ['an'] },
        { id: 'p5', type: 'fill', prompt: 'The feature requires an interface redesign and an update to ___ backend server. (fourth blank)', accept: ['the'] },
        { id: 'p6', type: 'fill', prompt: 'We identified ___ bug in ___ login module. (first blank)', accept: ['a'] },
        { id: 'p7', type: 'fill', prompt: 'We identified a bug in ___ login module. (second blank)', accept: ['the'] },
        { id: 'p8', type: 'fill', prompt: '... and agreed that ___ urgent fix is needed.', accept: ['an'] },
        { id: 'p9', type: 'fill', prompt: 'Additionally, ___ documentation for ___ API should be written before ___ release. (first blank)', accept: ['the'] },
        { id: 'p10', type: 'fill', prompt: 'Additionally, the documentation for ___ API should be written before ___ release. (second blank)', accept: ['the'] },
        { id: 'p11', type: 'fill', prompt: 'Additionally, the documentation for the API should be written before ___ release. (third blank)', accept: ['the'] },
        { id: 'p12', type: 'fill', prompt: 'Finally, ___ team highlighted ___ importance of ___ thorough testing during ___ development phase. (first blank)', accept: ['the'] },
        { id: 'p13', type: 'fill', prompt: 'Finally, the team highlighted ___ importance of ___ thorough testing during ___ development phase. (second blank)', accept: ['the'] },
        { id: 'p14', type: 'fill', prompt: 'Finally, the team highlighted the importance of ___ thorough testing during ___ development phase. (third blank)', accept: ['no article'] }
      ]
    }
    ,
    // Articles Lesson - Task 3: MCQ selection
    'articles-task-3': {
      id: 'articles-task-3',
      title: 'Task 3: Articles – Choose the Correct Option',
      description: 'Choose the correct article to complete each sentence.',
      instructions: [
        'Select one option for each item.',
        'Submit to see your score.'
      ],
      dueDate: '2025-10-07',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'm1', type: 'mcq', prompt: 'We encountered ___ unexpected error during deployment.', options: ['a','an','the','no article'], correctIndex: 1 },
        { id: 'm2', type: 'mcq', prompt: '___ team is working on the user authentication feature now.', options: ['a','an','the','no article'], correctIndex: 2 },
        { id: 'm3', type: 'mcq', prompt: 'Most ___ software engineers prefer agile methodologies.', options: ['a','an','the','no article'], correctIndex: 3 },
        { id: 'm4', type: 'mcq', prompt: 'I attended ___ meeting where the release date was discussed.', options: ['a','an','the','no article'], correctIndex: 0 },
        { id: 'm5', type: 'mcq', prompt: '___ data collected from users helps improve the product.', options: ['a','an','the','no article'], correctIndex: 2 }
      ]
    }
    ,
    // Grammar Lesson 2 - Tenses
    'grammar-tenses-task-1': {
      id: 'grammar-tenses-task-1',
      title: 'Task 1: Past Tense – Word Bank Fill',
      description: 'Fill in the blanks with the correct past tense form from the box.',
      instructions: [
        'Drag the correct past tense verb from the word bank into each sentence.',
        'Each word is used exactly once.'
      ],
      dueDate: '2025-11-20',
      maxScore: 10,
      submissionType: 'dragdrop',
      status: 'not-started',
      wordBank: ['fixed','deployed','forgot','attended','tested','reported','analyzed','wrote','prepared','finished'],
      sentences: [
        { text: 'Yesterday, the team ______ (fix) a major bug in the application.', answer: 'fixed' },
        { text: 'We ______ (deploy) the new version of the software last night.', answer: 'deployed' },
        { text: 'The developer ______ (forget) to commit his changes to GitHub.', answer: 'forgot' },
        { text: 'I ______ (attend) a meeting with the project manager yesterday.', answer: 'attended' },
        { text: 'They ______ (test) the program before releasing it.', answer: 'tested' },
        { text: 'Our client ______ (report) an error in the payment module.', answer: 'reported' },
        { text: 'We ______ (analyze) the system logs to find the issue.', answer: 'analyzed' },
        { text: 'She ______ (write) clean and efficient code for the project.', answer: 'wrote' },
        { text: 'The QA team ______ (prepare) a detailed bug report.', answer: 'prepared' },
        { text: 'We ______ (finish) the sprint successfully last Friday.', answer: 'finished' }
      ]
    },
    'grammar-tenses-task-2': {
      id: 'grammar-tenses-task-2',
      title: 'Task 2: Past Tense – Write the Form',
      description: 'Type the correct past tense of the given verbs.',
      instructions: ['Type the exact past tense form. Case-insensitive.'],
      dueDate: '2025-11-21',
      maxScore: 8,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'pt1', type: 'fill', prompt: 'Yesterday, I ______ (review) the code before the merge.', accept: ['reviewed'] },
        { id: 'pt2', type: 'fill', prompt: 'She ______ (check) the database for errors.', accept: ['checked'] },
        { id: 'pt3', type: 'fill', prompt: 'The team ______ (have) a stand-up meeting in the morning.', accept: ['had'] },
        { id: 'pt4', type: 'fill', prompt: 'We ______ (see) unexpected results after the update.', accept: ['saw'] },
        { id: 'pt5', type: 'fill', prompt: 'He ______ (run) several test cases on the new module.', accept: ['ran'] },
        { id: 'pt6', type: 'fill', prompt: 'I ______ (find) a critical bug in the login system.', accept: ['found'] },
        { id: 'pt7', type: 'fill', prompt: 'They ______ (go) through the client’s requirements carefully.', accept: ['went'] },
        { id: 'pt8', type: 'fill', prompt: 'The intern ______ (learn) a new programming language last month.', accept: ['learned','learnt'] }
      ]
    },
    'grammar-tenses-task-3': {
      id: 'grammar-tenses-task-3',
      title: 'Task 3: Future Tense – Rearrange Words',
      description: 'Rearrange the words to make correct future tense sentences (will + base verb).',
      instructions: ['Type the full correct sentence.'],
      dueDate: '2025-11-22',
      maxScore: 10,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'ft1', type: 'fill', prompt: 'deploy / tomorrow / we / new version / the / will', accept: ['we will deploy the new version tomorrow.','we will deploy the new version tomorrow'] },
        { id: 'ft2', type: 'fill', prompt: 'will / errors / fix / she / reported / the', accept: ['she will fix the reported errors.','she will fix the reported errors'] },
        { id: 'ft3', type: 'fill', prompt: 'client / requirements / share / the / will / new', accept: ['the client will share new requirements.','the client will share new requirements'] },
        { id: 'ft4', type: 'fill', prompt: 'logs / will / analyze / the team / system', accept: ['the team will analyze the system logs.','the team will analyze the system logs'] },
        { id: 'ft5', type: 'fill', prompt: 'will / QA / run / test cases / tomorrow / the', accept: ['the qa will run test cases tomorrow.','qa will run test cases tomorrow.','the QA will run test cases tomorrow.'] },
        { id: 'ft6', type: 'fill', prompt: 'attend / we / conference / will / next week / the', accept: ['we will attend the conference next week.','we will attend the conference next week'] },
        { id: 'ft7', type: 'fill', prompt: 'database / update / will / the / they', accept: ['they will update the database.','they will update the database'] },
        { id: 'ft8', type: 'fill', prompt: 'documentation / complete / will / I / project / the', accept: ['i will complete the project documentation.','I will complete the project documentation.'] },
        { id: 'ft9', type: 'fill', prompt: 'feedback / give / users / will / the', accept: ['the users will give feedback.','the users will give feedback'] },
        { id: 'ft10', type: 'fill', prompt: 'sprint / finish / team / will / the / Friday / on', accept: ['the team will finish the sprint on Friday.','the team will finish the sprint on friday.'] }
      ]
    },
    'grammar-tenses-task-4': {
      id: 'grammar-tenses-task-4',
      title: 'Task 4: Future Tense – Will + Verb',
      description: 'Fill in the blanks with the correct future tense form (will + verb).',
      instructions: ['Type will + base verb.'],
      dueDate: '2025-11-23',
      maxScore: 10,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'fv1', type: 'fill', prompt: 'Tomorrow, I ______ (review) the code changes.', accept: ['will review'] },
        { id: 'fv2', type: 'fill', prompt: 'She ______ (test) the new login feature next week.', accept: ['will test'] },
        { id: 'fv3', type: 'fill', prompt: 'They ______ (deploy) the app to production soon.', accept: ['will deploy'] },
        { id: 'fv4', type: 'fill', prompt: 'Our manager ______ (discuss) the roadmap in the meeting.', accept: ['will discuss'] },
        { id: 'fv5', type: 'fill', prompt: 'We ______ (write) unit tests for the new module.', accept: ['will write'] },
        { id: 'fv6', type: 'fill', prompt: 'He ______ (check) the server performance later.', accept: ['will check'] },
        { id: 'fv7', type: 'fill', prompt: 'The team ______ (fix) the bug before the release.', accept: ['will fix'] },
        { id: 'fv8', type: 'fill', prompt: 'I ______ (join) the client call tomorrow morning.', accept: ['will join'] },
        { id: 'fv9', type: 'fill', prompt: 'Developers ______ (work) on UI improvements.', accept: ['will work'] },
        { id: 'fv10', type: 'fill', prompt: 'The company ______ (launch) a new product next quarter.', accept: ['will launch'] }
      ]
    },
    'grammar-tenses-task-5': {
      id: 'grammar-tenses-task-5',
      title: 'Task 5: Present Simple – Choose the Form',
      description: 'Choose the correct present simple verb form.',
      instructions: ['Select one option per sentence.'],
      dueDate: '2025-11-24',
      maxScore: 10,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'ps1', type: 'mcq', prompt: 'She (write/writes) unit tests for the new feature.', options: ['write','writes'], correctIndex: 1 },
        { id: 'ps2', type: 'mcq', prompt: 'They (fix/fixes) bugs reported by the users.', options: ['fix','fixes'], correctIndex: 0 },
        { id: 'ps3', type: 'mcq', prompt: 'The server (run/runs) 24 hours a day.', options: ['run','runs'], correctIndex: 1 },
        { id: 'ps4', type: 'mcq', prompt: 'Our manager (conduct/conducts) a sprint review every Friday.', options: ['conduct','conducts'], correctIndex: 1 },
        { id: 'ps5', type: 'mcq', prompt: 'I (review/reviews) my teammate’s code before merging.', options: ['review','reviews'], correctIndex: 0 },
        { id: 'ps6', type: 'mcq', prompt: 'The application (store/stores) data in the cloud.', options: ['store','stores'], correctIndex: 1 },
        { id: 'ps7', type: 'mcq', prompt: 'We (use/uses) GitHub to manage our source code.', options: ['use','uses'], correctIndex: 0 },
        { id: 'ps8', type: 'mcq', prompt: 'He (check/checks) the system logs every morning.', options: ['check','checks'], correctIndex: 1 },
        { id: 'ps9', type: 'mcq', prompt: 'Developers (attend/attends) daily stand-up meetings.', options: ['attend','attends'], correctIndex: 0 },
        { id: 'ps10', type: 'mcq', prompt: 'The client (send/sends) feedback after each demo.', options: ['send','sends'], correctIndex: 1 }
      ]
    }
    ,
    // Modal Verbs Lesson - Task 1: Fill the blanks
    'modal-verbs-task-1': {
      id: 'modal-verbs-task-1',
      title: 'Task 1: Modal Verbs – Fill the Blanks',
      description: 'Fill in the blanks with the correct modal verb based on context.',
      instructions: [
        'Type the correct modal verb for each sentence (e.g., must, can, might, would, should).',
        'Answers are case-insensitive.'
      ],
      dueDate: '2025-10-09',
      maxScore: 5,
      submissionType: 'quiz',
      status: 'not-started',
      questions: [
        { id: 'mv1', type: 'fill', prompt: 'You ______ attend the meeting; it’s mandatory.', accept: ['must'] },
        { id: 'mv2', type: 'fill', prompt: 'He ______ solve this coding issue; he’s very skilled.', accept: ['can'] },
        { id: 'mv3', type: 'fill', prompt: 'We ______ need to push the release if the bug isn’t fixed.', accept: ['might'] },
        { id: 'mv4', type: 'fill', prompt: '______ you please share the project update with the client?', accept: ['would'] },
        { id: 'mv5', type: 'fill', prompt: 'The team ______ finish this sprint by Friday if everyone contributes.', accept: ['should'] }
      ]
    }
  };

  // Video drag-and-drop helpers
  function handleVideoDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleVideoDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleVideoDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const dtFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    const videoFiles = dtFiles.filter((f) => f.type.startsWith('video/'));
    if (videoFiles.length === 0) {
      alert('No video file detected. Please drop an MP4, WEBM, or MOV file.');
      return;
    }
    setFiles([videoFiles[0]]);
  }

  function removePlaced(index) {
    setDdAnswers((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  }

  function resetDD() {
    setDdAnswers({});
    setDdScore(null);
    setDdShowResults(false);
    setIsSubmitted(false);
    setDdTexts({});
  }

  const handleTextChange = (index, value) => {
    setDdTexts((prev) => ({ ...prev, [index]: value }));
  };

  useEffect(() => {
    const assignmentInfo = assignmentData[assignmentId];
    if (assignmentInfo) {
      setAssignment(assignmentInfo);
      // Reset all states when loading a new assignment
      setIsSubmitted(false);
      setDdAnswers({});
      setDdScore(null);
      setDdShowResults(false);
      setQuizAnswers({});
      setQuizScore(null);
      setQuizShowResults(false);
      setSubmission('');
      setFiles([]);
      setDdTexts({});
    }
  }, [assignmentId]);

  const handleSubmissionChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Drag & Drop helpers (function declarations to avoid hoisting/definition issues)
  function handleDragStart(e, token) {
    // use a consistent key for set/get
    e.dataTransfer.setData('token', token);
  }

  function handleDrop(e, index) {
    e.preventDefault();
    const token = e.dataTransfer.getData('token');
    if (token) {
      setDdAnswers((prev) => ({ ...prev, [index]: token }));
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  // Quiz-specific helpers
  function handleQuizMCQChange(qid, index) {
    setQuizAnswers((prev) => ({ ...prev, [qid]: index }));
  }
  function handleQuizFillChange(qid, value) {
    setQuizAnswers((prev) => ({ ...prev, [qid]: (value || '') }));
  }
  function handleQuizTFChange(qid, value) {
    setQuizAnswers((prev) => ({ ...prev, [qid]: value }));
  }
  function handleQuizDragStart(e, token) {
    e.dataTransfer.setData('token', token);
  }
  function handleQuizDrop(e, qid, index) {
    e.preventDefault();
    const token = e.dataTransfer.getData('token');
    if (!token) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [qid]: { ...(typeof prev[qid] === 'object' ? prev[qid] : {}), [index]: token },
    }));
  }
  function quizRemovePlaced(qid, index) {
    setQuizAnswers((prev) => {
      const cur = typeof prev[qid] === 'object' ? { ...prev[qid] } : {};
      delete cur[index];
      return { ...prev, [qid]: cur };
    });
  }
  function quizReset() {
    setQuizAnswers({});
    setQuizScore(null);
    setQuizShowResults(false);
  }

  // Missing helper functions for drag-drop and other assignment types
  function removePlaced(index) {
    setDdAnswers((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  }

  function resetDD() {
    setDdAnswers({});
    setDdScore(null);
    setDdShowResults(false);
    setDdTexts({});
  }


  // Video drag-drop handlers
  function handleVideoDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleVideoDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleVideoDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    const videoFiles = droppedFiles.filter((f) => f.type.startsWith('video/'));
    if (videoFiles.length > 0) {
      setFiles([videoFiles[0]]);
    }
  }

  // Compute score for quiz-type assignments (supports mcq, fill, truefalse, and match inside quiz)
  function computeQuizScore(assignment) {
    const questions = assignment.questions || [];
    let score = 0;
    let max = 0;
    questions.forEach((q) => {
      if (q.type === 'mcq') {
        max += 1;
        const sel = quizAnswers[q.id];
        if (typeof sel === 'number' && sel === q.correctIndex) score += 1;
      } else if (q.type === 'fill') {
        max += 1;
        const val = (quizAnswers[q.id] || '').toString().trim().toLowerCase();
        const accepts = (q.accept || []).map((a) => a.trim().toLowerCase());
        if (val && accepts.includes(val)) score += 1;
      } else if (q.type === 'truefalse') {
        max += 1;
        if (typeof quizAnswers[q.id] === 'boolean' && quizAnswers[q.id] === q.correct) score += 1;
      } else if (q.type === 'match') {
        // For match, count each pair as 1 point
        const placed = quizAnswers[q.id] || {};
        (q.items || []).forEach((_, idx) => {
          max += 1;
          const token = (placed[idx] || '').toString().trim().toLowerCase();
          const correctKey = (q.answers[idx] || '').toString().trim().toLowerCase();
          if (token && token === correctKey) score += 1;
        });
      }
    });
    return { score, max };
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Interactive drag & drop submission
    if (assignment.submissionType === 'dragdrop') {
      const total = assignment.sentences.length;
      const filled = Object.keys(ddAnswers).length;
      if (filled < total) {
        alert(`Please fill all blanks (${filled}/${total}) before submitting.`);
        return;
      }
      let score = 0;
      assignment.sentences.forEach((s, idx) => {
        if ((ddAnswers[idx] || '').trim().toLowerCase() === s.answer.trim().toLowerCase()) {
          score += 1;
        }
      });
      setDdScore(score);
      setDdShowResults(true);
      setIsSubmitted(true);
      return;
    }
    if (assignment.submissionType === 'match') {
      const total = assignment.phrases.length;
      const filled = Object.keys(ddAnswers).length;
      if (filled < total) {
        alert(`Please match all rows (${filled}/${total}) before submitting.`);
        return;
      }
      let score = 0;
      assignment.answers.forEach((correctKey, idx) => {
        if ((ddAnswers[idx] || '').trim().toUpperCase() === correctKey.trim().toUpperCase()) {
          score += 1;
        }
      });
      setDdScore(score);
      setDdShowResults(true);
      setIsSubmitted(true);
      return;
    }

    if (assignment.submissionType === 'quiz') {
      // Validate all questions answered
      const questions = assignment.questions || [];
      for (const q of questions) {
        if (q.type === 'mcq') {
          if (typeof quizAnswers[q.id] !== 'number') {
            alert('Please answer all multiple choice questions before submitting.');
            return;
          }
        } else if (q.type === 'fill') {
          const val = (quizAnswers[q.id] || '').toString().trim();
          if (!val) {
            alert('Please complete all fill-in-the-blank questions before submitting.');
            return;
          }
        } else if (q.type === 'truefalse') {
          if (typeof quizAnswers[q.id] !== 'boolean') {
            alert('Please answer all True/False questions before submitting.');
            return;
          }
        } else if (q.type === 'match') {
          const placed = quizAnswers[q.id] || {};
          const total = (q.items || []).length;
          if (Object.keys(placed).length < total) {
            alert('Please complete all matching items before submitting.');
            return;
          }
        }
      }

      const { score, max } = computeQuizScore(assignment);
      setQuizScore(score);
      setQuizShowResults(true);

      const submissionData = {
        type: 'quiz',
        submittedAt: new Date().toISOString(),
        studentEmail: currentUser?.email,
        data: { answers: quizAnswers, score, max }
      };
      addSubmission(assignmentId, submissionData);
      setIsSubmitted(true);
      return;
    }

    if (assignment.submissionType === 'text' && submission.trim().length < 50) {
      alert('Please write at least 50 characters for your submission.');
      return;
    }
    
    if (assignment.submissionType === 'file' && files.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }

    if (assignment.submissionType === 'video') {
      if (files.length === 0) {
        alert('Please add a video file to submit.');
        return;
      }
      const f = files[0];
      if (!f.type.startsWith('video/')) {
        alert('Please upload a valid video file (MP4, WEBM, MOV).');
        return;
      }
    }

    // Prepare submission data
    const submissionData = {
      type: assignment.submissionType,
      submittedAt: new Date().toISOString(),
      studentEmail: currentUser?.email,
      data: {}
    };

    // Add specific submission data based on type
    if (assignment.submissionType === 'dragdrop' || assignment.submissionType === 'match') {
      submissionData.data = { answers: ddAnswers, score: ddScore };
    } else if (assignment.submissionType === 'quiz') {
      submissionData.data = { answers: quizAnswers, score: quizScore };
    } else if (assignment.submissionType === 'text') {
      submissionData.data = { text: submission };
    } else if (assignment.submissionType === 'file' || assignment.submissionType === 'video') {
      submissionData.data = { files: files.map(f => ({ name: f.name, size: f.size, type: f.type })) };
    }

    // Update assignment status to completed with submission data
    addSubmission(assignmentId, submissionData);
    setIsSubmitted(true);
    
    // Show success message based on submission type
    const isAutoGraded = ['quiz', 'dragdrop', 'match'].includes(assignment.submissionType);
    const message = isAutoGraded 
      ? '🎉 Task completed successfully! Your score has been calculated automatically.'
      : '📝 Task submitted successfully! Your submission will be reviewed by the instructor.';
    
    setTimeout(() => {
      alert(message);
      // Don't auto-redirect for manual grading submissions
      if (isAutoGraded) {
        navigate('/assignments');
      }
    }, 500);
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-primary-600 hover:text-primary-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Techlish
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              <p className="text-gray-600 mb-4">{assignment.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                  </svg>
                  <span className="text-gray-600">Max Score: {assignment.maxScore} points</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                  </svg>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Due: {assignment.dueDate}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-2">
              {assignment.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Drag & Drop UI */}
        {assignment.submissionType === 'dragdrop' && !isSubmitted && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task 1</h3>
            <p className="text-gray-600 mb-4">Complete each sentence with the correct word from the box.</p>

            {/* Word Bank */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {assignment.wordBank.map((token, idx) => {
                  const used = Object.values(ddAnswers).includes(token);
                  return (
                    <div
                      key={idx}
                      draggable={!used}
                      onDragStart={(e) => handleDragStart(e, token)}
                      className={`px-3 py-2 rounded border bg-white text-sm text-gray-800 shadow-sm select-none ${
                        used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'
                      }`}
                      title={used ? 'Already used' : 'Drag to a blank'}
                    >
                      {token}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sentences */}
            <div className="space-y-4">
              {assignment.sentences.map((s, index) => {
                const placed = ddAnswers[index];
                const isCorrect = ddShowResults && placed && placed.trim().toLowerCase() === s.answer.trim().toLowerCase();
                const isWrong = ddShowResults && placed && !isCorrect;
                return (
                  <div key={index} className="text-gray-800">
                    <div className="flex items-start">
                      <span className="mr-2 text-gray-500">{index + 1}.</span>
                      <div className="flex-1">
                        {s.text.split('__________').length > 1 ? (
                          <div className="flex flex-wrap items-center">
                            <span>{s.text.split('__________')[0]}</span>
                            <div
                              onDrop={(e) => handleDrop(e, index)}
                              onDragOver={handleDragOver}
                              className={`min-w-[140px] inline-flex items-center justify-between px-3 py-2 border-2 rounded-md mx-2 bg-white ${
                                ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'
                              }`}
                            >
                              {placed ? (
                                <button type="button" onClick={() => removePlaced(index)} className="text-sm text-gray-800">
                                  {placed}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400">Drop word here</span>
                              )}
                            </div>
                            <span>{s.text.split('__________')[1]}</span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center">
                            <span>{s.text.replace('_____', '')}</span>
                            <div
                              onDrop={(e) => handleDrop(e, index)}
                              onDragOver={handleDragOver}
                              className={`min-w-[140px] inline-flex items-center justify-between px-3 py-2 border-2 rounded-md mx-2 bg-white ${
                                ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'
                              }`}
                            >
                              {placed ? (
                                <button type="button" onClick={() => removePlaced(index)} className="text-sm text-gray-800">
                                  {placed}
                                </button>
                              ) : (
                                <span className="text-sm text-gray-400">Drop word here</span>
                              )}
                            </div>
                          </div>
                        )}

        {/* Quiz Section */}
        {assignment.submissionType === 'quiz' && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Quiz</h3>
            {assignment.audioSrc ? (
              <div className="mb-4">
                <audio
                  ref={audioRef}
                  controls={audioPlays < 3}
                  onPlay={() => {
                    setAudioPlays((prev) => {
                      const next = prev + 1;
                      if (next >= 3 && audioRef.current) {
                        audioRef.current.onended = () => {
                          if (audioRef.current) audioRef.current.controls = false;
                        };
                      }
                      return next;
                    });
                  }}
                  className="w-full"
                >
                  <source src={assignment.audioSrc} />
                  Your browser does not support the audio element.
                </audio>
                <div className="text-sm text-gray-600 mt-2">
                  Plays used: {audioPlays} / 3 {audioPlays >= 3 && <span className="text-red-600 ml-2">Audio limit reached</span>}
                </div>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-500">No audio provided.</div>
            )}

            <div className="space-y-6">
              {(assignment.questions || []).map((q, qIndex) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900">Q{qIndex + 1}. {q.prompt}</p>
                    {quizShowResults && (
                      <span className="text-xs text-gray-500">{q.type.toUpperCase()}</span>
                    )}
                  </div>

                  {q.type === 'mcq' && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, idx) => {
                        const selected = quizAnswers[q.id] === idx;
                        const correct = quizShowResults && idx === q.correctIndex;
                        const wrong = quizShowResults && selected && idx !== q.correctIndex;
                        return (
                          <label key={idx} className={`flex items-center p-2 rounded cursor-pointer ${correct ? 'bg-green-50' : wrong ? 'bg-red-50' : ''}`}>
                            <input
                              type="radio"
                              name={`mcq-${q.id}`}
                              checked={selected || false}
                              onChange={() => handleQuizMCQChange(q.id, idx)}
                              className="mr-2"
                            />
                            <span className="text-gray-800">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Type your answer"
                        value={(quizAnswers[q.id] || '')}
                        onChange={(e) => handleQuizFillChange(q.id, e.target.value)}
                      />
                      {quizShowResults && (
                        <p className="mt-2 text-sm text-gray-600">Accepted: {q.accept.join(', ')}</p>
                      )}
                    </div>
                  )}

                  {q.type === 'truefalse' && (
                    <div className="mt-3 space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`tf-${q.id}`}
                          checked={quizAnswers[q.id] === true}
                          onChange={() => handleQuizTFChange(q.id, true)}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`tf-${q.id}`}
                          checked={quizAnswers[q.id] === false}
                          onChange={() => handleQuizTFChange(q.id, false)}
                          className="mr-2"
                        />
                        False
                      </label>
                      {quizShowResults && (
                        <span className="ml-4 text-sm text-gray-600">Correct: {q.correct ? 'True' : 'False'}</span>
                      )}
                    </div>
                  )}

                  {q.type === 'match' && (
                    <div className="mt-3">
                      {/* Word Bank */}
                      <div className="border rounded-lg p-3 bg-gray-50 mb-3">
                        <div className="flex flex-wrap gap-2">
                          {q.functionBank.map((fn) => {
                            const used = Object.values((quizAnswers[q.id] || {})).includes(fn.key);
                            return (
                              <div
                                key={fn.key}
                                draggable={!used}
                                onDragStart={(e) => handleQuizDragStart(e, fn.key)}
                                className={`px-2 py-1 rounded border bg-white text-xs shadow-sm select-none ${used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'}`}
                              >
                                <span className="font-semibold mr-1 uppercase">{fn.key}</span>
                                <span className="text-gray-700">{fn.text || '—'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items to match */}
                      <div className="space-y-2">
                        {q.items.map((it, idx) => {
                          const placed = (quizAnswers[q.id] || {})[idx];
                          const correctKey = q.answers[idx];
                          const isCorrect = quizShowResults && placed && placed.toLowerCase() === correctKey.toLowerCase();
                          return (
                            <div key={idx} className="flex items-center">
                              <div className="w-1/2 pr-2 text-gray-800">{it}</div>
                              <div className="w-1/2">
                                <div
                                  onDrop={(e) => handleQuizDrop(e, q.id, idx)}
                                  onDragOver={handleDragOver}
                                  className={`inline-flex min-w-[120px] items-center px-3 py-2 border-2 rounded-md bg-white ${quizShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'}`}
                                >
                                  {placed ? (
                                    <button type="button" onClick={() => quizRemovePlaced(q.id, idx)} className="text-sm font-semibold text-gray-800">
                                      {placed.toUpperCase()}
                                    </button>
                                  ) : (
                                    <span className="text-sm text-gray-400">Drop key here</span>
                                  )}
                                </div>
                                {quizShowResults && (
                                  <div className="mt-1 text-xs text-gray-600">Correct: <span className="font-semibold uppercase">{correctKey}</span></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button type="button" onClick={quizReset} className="btn-secondary">Reset</button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            </div>

            {quizShowResults && (
              <div className="mt-6 p-4 rounded bg-gray-50 border">
                <p className="font-semibold text-gray-800">Score: {quizScore} / {assignment.maxScore}</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz Section */}
        {assignment.submissionType === 'quiz' && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Quiz</h3>
            {assignment.audioSrc ? (
              <div className="mb-4">
                <audio
                  ref={audioRef}
                  controls={audioPlays < 3}
                  onPlay={() => {
                    setAudioPlays((prev) => {
                      const next = prev + 1;
                      if (next >= 3 && audioRef.current) {
                        audioRef.current.onended = () => {
                          if (audioRef.current) audioRef.current.controls = false;
                        };
                      }
                      return next;
                    });
                  }}
                  className="w-full"
                >
                  <source src={assignment.audioSrc} />
                  Your browser does not support the audio element.
                </audio>
                <div className="text-sm text-gray-600 mt-2">
                  Plays used: {audioPlays} / 3 {audioPlays >= 3 && <span className="text-red-600 ml-2">Audio limit reached</span>}
                </div>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-500">No audio provided.</div>
            )}

            <div className="space-y-6">
              {(assignment.questions || []).map((q, qIndex) => (
                <div key={q.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900">Q{qIndex + 1}. {q.prompt}</p>
                    {quizShowResults && (
                      <span className="text-xs text-gray-500">{q.type.toUpperCase()}</span>
                    )}
                  </div>

                  {q.type === 'mcq' && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, idx) => {
                        const selected = quizAnswers[q.id] === idx;
                        const correct = quizShowResults && idx === q.correctIndex;
                        const wrong = quizShowResults && selected && idx !== q.correctIndex;
                        return (
                          <label key={idx} className={`flex items-center p-2 rounded cursor-pointer ${correct ? 'bg-green-50' : wrong ? 'bg-red-50' : ''}`}>
                            <input
                              type="radio"
                              name={`mcq-${q.id}`}
                              checked={selected || false}
                              onChange={() => handleQuizMCQChange(q.id, idx)}
                              className="mr-2"
                            />
                            <span className="text-gray-800">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Type your answer"
                        value={(quizAnswers[q.id] || '')}
                        onChange={(e) => handleQuizFillChange(q.id, e.target.value)}
                      />
                      {quizShowResults && (
                        <p className="mt-2 text-sm text-gray-600">Accepted: {q.accept.join(', ')}</p>
                      )}
                    </div>
                  )}

                  {q.type === 'truefalse' && (
                    <div className="mt-3 space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`tf-${q.id}`}
                          checked={quizAnswers[q.id] === true}
                          onChange={() => handleQuizTFChange(q.id, true)}
                          className="mr-2"
                        />
                        True
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`tf-${q.id}`}
                          checked={quizAnswers[q.id] === false}
                          onChange={() => handleQuizTFChange(q.id, false)}
                          className="mr-2"
                        />
                        False
                      </label>
                      {quizShowResults && (
                        <span className="ml-4 text-sm text-gray-600">Correct: {q.correct ? 'True' : 'False'}</span>
                      )}
                    </div>
                  )}

                  {q.type === 'match' && (
                    <div className="mt-3">
                      {/* Word Bank */}
                      <div className="border rounded-lg p-3 bg-gray-50 mb-3">
                        <div className="flex flex-wrap gap-2">
                          {q.functionBank.map((fn) => {
                            const used = Object.values((quizAnswers[q.id] || {})).includes(fn.key);
                            return (
                              <div
                                key={fn.key}
                                draggable={!used}
                                onDragStart={(e) => handleQuizDragStart(e, fn.key)}
                                className={`px-2 py-1 rounded border bg-white text-xs shadow-sm select-none ${used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'}`}
                              >
                                <span className="font-semibold mr-1 uppercase">{fn.key}</span>
                                <span className="text-gray-700">{fn.text || '—'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items to match */}
                      <div className="space-y-2">
                        {q.items.map((it, idx) => {
                          const placed = (quizAnswers[q.id] || {})[idx];
                          const correctKey = q.answers[idx];
                          const isCorrect = quizShowResults && placed && placed.toLowerCase() === correctKey.toLowerCase();
                          return (
                            <div key={idx} className="flex items-center">
                              <div className="w-1/2 pr-2 text-gray-800">{it}</div>
                              <div className="w-1/2">
                                <div
                                  onDrop={(e) => handleQuizDrop(e, q.id, idx)}
                                  onDragOver={handleDragOver}
                                  className={`inline-flex min-w-[120px] items-center px-3 py-2 border-2 rounded-md bg-white ${quizShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'}`}
                                >
                                  {placed ? (
                                    <button type="button" onClick={() => quizRemovePlaced(q.id, idx)} className="text-sm font-semibold text-gray-800">
                                      {placed.toUpperCase()}
                                    </button>
                                  ) : (
                                    <span className="text-sm text-gray-400">Drop key here</span>
                                  )}
                                </div>
                                {quizShowResults && (
                                  <div className="mt-1 text-xs text-gray-600">Correct: <span className="font-semibold uppercase">{correctKey}</span></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button type="button" onClick={quizReset} className="btn-secondary">Reset</button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            </div>

            {quizShowResults && (
              <div className="mt-6 p-4 rounded bg-gray-50 border">
                <p className="font-semibold text-gray-800">Score: {quizScore} / {assignment.maxScore}</p>
              </div>
            )}
          </div>
        )}

        {/* Matching Table (Phrase ↔ Function) */}
        {assignment.submissionType === 'match' && !isSubmitted && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Match the Negotiation Phrase</h3>
            <p className="text-gray-600 mb-6">Drag a function label (A–F) from the word bank into the matching row in Column B.</p>

            {/* Word Bank */}
            <div className="border rounded-lg p-4 bg-gray-50 mb-6">
              <div className="flex flex-wrap gap-3">
                {assignment.functions.map((fn, idx) => {
                  const used = Object.values(ddAnswers).includes(fn.key);
                  return (
                    <div
                      key={fn.key}
                      draggable={!used}
                      onDragStart={(e) => handleDragStart(e, fn.key)}
                      className={`px-3 py-2 rounded border bg-white text-sm shadow-sm select-none ${used ? 'opacity-40 cursor-not-allowed' : 'cursor-move hover:bg-primary-50'}`}
                      title={fn.text}
                    >
                      <span className="font-semibold mr-2">{fn.key}</span>
                      <span className="text-gray-700">{fn.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column A – Phrase</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column B – Function (A–F)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignment.phrases.map((phrase, index) => {
                    const placed = ddAnswers[index];
                    const correctKey = assignment.answers[index];
                    const isCorrect = ddShowResults && placed && placed.toUpperCase() === correctKey.toUpperCase();
                    return (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-500 align-top">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 align-top">{phrase}</td>
                        <td className="px-4 py-3 align-top">
                          <div
                            onDrop={(e) => handleDrop(e, index)}
                            onDragOver={handleDragOver}
                            className={`inline-flex min-w-[160px] items-center px-3 py-2 border-2 rounded-md bg-white ${ddShowResults ? (isCorrect ? 'border-green-400' : 'border-red-400') : 'border-dashed border-gray-300'}`}
                          >
                            {placed ? (
                              <button type="button" onClick={() => removePlaced(index)} className="text-sm font-semibold text-gray-800">
                                {placed}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">Drop A–F here</span>
                            )}
                          </div>
                          {ddShowResults && (
                            <div className="mt-1 text-xs text-gray-600">Correct: <span className="font-semibold">{correctKey}</span> — {assignment.functions.find(f => f.key === correctKey)?.text}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button type="button" onClick={resetDD} className="btn-secondary">Reset</button>
              <form onSubmit={handleSubmit}>
                <button type="submit" className="btn-primary">Submit</button>
              </form>
            </div>

            {ddShowResults && (
              <div className="mt-6 p-4 rounded bg-gray-50 border">
                <p className="font-semibold text-gray-800">Score: {ddScore} / {assignment.maxScore}</p>
              </div>
            )}
          </div>
        )}

        {/* Video Upload (Drag & Drop) */}
        {assignment.submissionType === 'video' && !isSubmitted && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Presentation Video</h3>
            <div
              className={`border-2 rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-600 bg-primary-50' : 'border-dashed border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleVideoDragOver}
              onDragEnter={handleVideoDragOver}
              onDragLeave={handleVideoDragLeave}
              onDrop={handleVideoDrop}
            >
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553 2.276A2 2 0 0121 14.09v.82a2 2 0 01-1.447 1.914L15 19M4 6h8m0 0V4m0 2v2" />
              </svg>
              <p className="text-gray-700 mb-2">Drag and drop your video file here</p>
              <p className="text-sm text-gray-500 mb-4">or click the button below to browse</p>
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const arr = Array.from(e.target.files || []);
                  const videoFiles = arr.filter((f) => f.type.startsWith('video/'));
                  if (videoFiles.length > 0) setFiles([videoFiles[0]]);
                }}
              />
              <label htmlFor="videoInput" className="btn-secondary cursor-pointer">Browse Video</label>

              {files.length > 0 && files[0] && (
                <div className="mt-6 text-left">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Video</h4>
                  <div className="bg-white p-4 border rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">{files[0].name} <span className="text-gray-400">({(files[0].size / 1024 / 1024).toFixed(2)} MB)</span></p>
                    <video
                      controls
                      className="w-full rounded"
                      src={URL.createObjectURL(files[0])}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end mt-6">
                <form onSubmit={handleSubmit}>
                  <button type="submit" className="btn-primary">Submit Video</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Submission Section (Text/File only) */}
        {(assignment.submissionType === 'text' || assignment.submissionType === 'file') && !isSubmitted && (
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Submit Your Work</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {assignment.submissionType === 'text' ? (
                <div>
                  <label htmlFor="submission" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    id="submission"
                    rows={12}
                    className="input-field resize-none"
                    placeholder="Type your response here..."
                    value={submission}
                    onChange={handleSubmissionChange}
                    required
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Character count: {submission.length}
                    {assignment.id === 'essay-future-goals' && (
                      <span className="ml-2">
                        (Approximately {Math.round(submission.split(' ').length)} words)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <input
                      id="files"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="files" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Click to upload files
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB each
                    </p>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                      <ul className="space-y-2">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  💡 Make sure to review your work before submitting
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    (assignment.submissionType === 'text' && submission.trim().length < 50) ||
                    (assignment.submissionType === 'file' && files.length === 0)
                  }
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Submitted view (any type) */}
        {isSubmitted && (
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Assignment Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your assignment has been submitted successfully. You will receive feedback within 3-5 business days.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/dashboard" className="btn-primary">
                Back to Dashboard
              </Link>
              <button className="btn-secondary">
                View Submission
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
