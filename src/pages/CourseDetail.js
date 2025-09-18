// Course detail page with PDF content viewer and lesson management
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAssignments } from '../contexts/AssignmentsContext';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { currentUser, logout } = useAuth();
  const { addAssignment } = useAssignments();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  // Add task to assignments when component mounts
  useEffect(() => {
    if (course && course.lessons) {
      course.lessons.forEach(lesson => {
        if (lesson.task) {
          addAssignment({
            id: lesson.task.id,
            title: lesson.task.title,
            description: lesson.task.description,
            courseId: course.id,
            courseName: course.title,
            lessonId: lesson.id,
            lessonName: lesson.title,
            dueDate: lesson.task.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        }
      });
    }
  }, [course, addAssignment]);

  // Mock course data - in a real app, this would come from Firebase/database
  const courseData = {
    'grammar-fundamentals': {
      id: 'grammar-fundamentals',
      title: 'English Grammar Fundamentals',
      description: 'Master the fundamentals of English grammar with comprehensive lessons and exercises',
      duration: '7 days',
      level: 'Beginner',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Introduction to Parts of Speech',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-1',
            title: 'Task 1: Parts of Speech Practice',
            description: 'Identify and categorize different parts of speech in sentences',
            dueDate: '2025-10-05'
          }
        },
        {
          id: 2,
          title: 'Lesson 2 - Nouns and Pronouns',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-2',
            title: 'Task 2: Nouns and Pronouns Exercise',
            description: 'Practice using different types of nouns and pronouns correctly',
            dueDate: '2025-10-06'
          }
        },
        {
          id: 3,
          title: 'Lesson 3 - Verbs and Tenses',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-3',
            title: 'Task 3: Verb Tenses Practice',
            description: 'Complete exercises on past, present, and future tenses',
            dueDate: '2025-10-07'
          }
        },
        {
          id: 4,
          title: 'Lesson 4 - Linking Words',
          type: 'content',
          content: `
            <h4>What are linking words?</h4>
            <p>Linking words (connectors/transition words) connect ideas smoothly, ensure logical progression, and make your speech easier to follow. Using them effectively signals relationships between ideas, shows the flow of your argument, and enhances professionalism.</p>

            <h4 class="mt-4">Categories of Linking Words and Their Functions</h4>
            <div class="overflow-x-auto mt-2">
              <table class="min-w-full border border-gray-300 text-sm">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="border border-gray-300 px-3 py-2 text-left">Function</th>
                    <th class="border border-gray-300 px-3 py-2 text-left">Linking Words</th>
                    <th class="border border-gray-300 px-3 py-2 text-left">Example in a Technical Presentation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 px-3 py-2 align-top">Adding Information</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">furthermore, moreover, in addition, also</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“The new software reduces processing time. Moreover, it improves data security.”</em></td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 align-top">Contrasting Ideas</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">however, on the other hand, whereas, although, in contrast</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“The old system was fast. However, it was prone to errors.”</em></td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-3 py-2 align-top">Giving Examples</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">for example, such as, in particular, to illustrate</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“Several tools, for example Jenkins and Travis CI, can automate testing.”</em></td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 align-top">Sequencing / Ordering</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">first of all, then, next, finally, subsequently</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“First of all, I will explain the architecture. Then, I will demonstrate the deployment process. Finally, I will summarise the benefits.”</em></td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 px-3 py-2 align-top">Cause and Effect</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">therefore, as a result, consequently, thus</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“The system failed to integrate properly. As a result, we had to postpone the release.”</em></td>
                  </tr>
                  <tr class="bg-gray-50">
                    <td class="border border-gray-300 px-3 py-2 align-top">Summarising / Concluding</td>
                    <td class="border border-gray-300 px-3 py-2 align-top">in conclusion, to sum up, overall, in short</td>
                    <td class="border border-gray-300 px-3 py-2 align-top"><em>“In conclusion, the new approach increases efficiency and reduces errors.”</em></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 class="mt-6">Tips for Using Linking Words Effectively</h4>
            <div class="space-y-4 mt-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium text-gray-800">Vary your connectors:</p>
                <p class="mt-1 text-gray-700">Avoid repeating the same words too often; it makes your presentation more engaging.</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium text-gray-800">Position carefully:</p>
                <p class="mt-1 text-gray-700">Most linking words are best placed at the beginning of a sentence or clause for clarity.</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium text-gray-800">Match function to context:</p>
                <p class="mt-1 text-gray-700">Ensure the connector correctly reflects the relationship between ideas (e.g., don't use "however" when adding information).</p>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium text-gray-800">Combine with intonation:</p>
                <p class="mt-1 text-gray-700">Pause slightly when introducing a linking word to signal a transition to the audience.</p>
              </div>
              
              <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r">
                <h5 class="font-semibold text-blue-800 mb-2">Example of Integrated Use</h5>
                <p class="text-blue-900 italic">"First of all, I will explain the system architecture. Then, I will move on to the implementation details. Moreover, I will highlight the potential risks. Finally, I will summarise the benefits of our approach."</p>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
              <h3 class="text-lg font-semibold text-yellow-800">Practice Exercises</h3>
              <p class="text-yellow-700">Test your understanding with these exercises:</p>
              
              <div class="mt-4 space-y-6">
                <div>
                  <p class="font-medium">Q1. Multiple Choice</p>
                  <p>Linking words are also known as:</p>
                  <div class="ml-4 space-y-1">
                    <p>a) Verbs</p>
                    <p>b) Adjectives</p>
                    <p>c) Connectors</p>
                    <p>d) Pronouns</p>
                  </div>
                  <div class="mt-2 p-2 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">Answer: c) Connectors</p>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Q2. Fill in the Blank</p>
                  <p>The new system is faster. ______, it is more reliable.</p>
                  <div class="mt-2">
                    <input type="text" class="border rounded p-1 w-full max-w-md" placeholder="Type your answer here..." />
                  </div>
                  <div class="mt-2 p-2 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">Possible answers: Moreover, Furthermore, Additionally, Also</p>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Q3. Matching</p>
                  <p>Match the linking word with its correct function:</p>
                  <div class="grid grid-cols-2 gap-2 mt-2">
                    <div>However, →</div>
                    <div>For example, →</div>
                    <div>Finally, →</div>
                    <div>Therefore →</div>
                    <div>In conclusion →</div>
                  </div>
                  <div class="mt-2">
                    <div class="flex items-center space-x-2 mb-2">
                      <select class="border rounded p-1">
                        <option value="">Select function</option>
                        <option value="contrast">Contrast</option>
                        <option value="example">Example</option>
                        <option value="sequence">Sequence</option>
                        <option value="result">Result</option>
                        <option value="summary">Summary</option>
                      </select>
                      <span class="text-sm text-gray-500">Drag to match</span>
                    </div>
                  </div>
                  <div class="mt-2 p-2 bg-gray-50 rounded">
                    <p class="text-sm text-gray-600">Answers: However → Contrast, For example → Example, Finally → Sequence, Therefore → Result, In conclusion → Summary</p>
                  </div>
                  <div class="mt-2 ml-4">
                    <p>Functions:</p>
                    <p>a) Summarising</p>
                    <p>b) Cause & effect</p>
                    <p>c) Giving examples</p>
                    <p>d) Sequencing</p>
                    <p>e) Contrasting ideas</p>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Q4. True / False</p>
                  <p>"Linking words should always be placed at the end of a sentence."</p>
                </div>

                <div>
                  <p class="font-medium">Q5. Multiple Choice</p>
                  <p>Which category does the word "consequently" belong to?</p>
                  <div class="ml-4 space-y-1">
                    <p>a) Adding information</p>
                    <p>b) Sequencing</p>
                    <p>c) Cause & effect</p>
                    <p>d) Summarising</p>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Q6. Fill in the Blank</p>
                  <p>Several platforms, ______ Google Meet and Zoom, support online collaboration.</p>
                </div>

                <div>
                  <p class="font-medium">Q7. Multiple Choice</p>
                  <p>Which sequence of connectors is best for organising a presentation?</p>
                  <div class="ml-4 space-y-1">
                    <p>a) Then – However – But – Anyway</p>
                    <p>b) First of all – Next – Moreover – Finally</p>
                    <p>c) Finally – Next – Moreover – First of all</p>
                    <p>d) However – Moreover – For example – In short</p>
                  </div>
                </div>

                <div>
                  <p class="font-medium">Q8. True / False</p>
                  <p>Using varied connectors makes a presentation more engaging.</p>
                </div>

                <div>
                  <p class="font-medium">Q9. Fill in the Blank</p>
                  <p>The team missed the deadline. ______, the project was delayed.</p>
                </div>

                <div>
                  <p class="font-medium">Q10. Multiple Choice</p>
                  <p>Which of the following is not a summarising connector?</p>
                  <div class="ml-4 space-y-1">
                    <p>a) In conclusion</p>
                    <p>b) To sum up</p>
                    <p>c) Overall</p>
                    <p>d) On the other hand</p>
                  </div>
                </div>
              </div>

              <div class="mt-6 p-4 bg-white border rounded">
                <h4 class="font-semibold text-gray-700 mb-2">Answer Key:</h4>
                <ol class="list-decimal pl-5 space-y-1 text-sm">
                  <li>c) Connectors</li>
                  <li>Moreover / Furthermore</li>
                  <li>1 → e) Contrasting ideas, 2 → c) Giving examples, 3 → d) Sequencing, 4 → b) Cause & effect, 5 → a) Summarising</li>
                  <li>False</li>
                  <li>c) Cause & effect</li>
                  <li>such as</li>
                  <li>b) First of all – Next – Moreover – Finally</li>
                  <li>True</li>
                  <li>As a result / Therefore</li>
                  <li>d) On the other hand</li>
                </ol>
              </div>
            </div>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Vary your connectors:</strong> Avoid repeating the same words too often; it keeps your presentation engaging.</li>
              <li><strong>Position carefully:</strong> Many linking words work best at the beginning of a sentence or clause for clarity.</li>
              <li><strong>Match function to context:</strong> Ensure the connector reflects the relationship between ideas (e.g., don’t use “however” when adding information).</li>
              <li><strong>Combine with intonation:</strong> Pause slightly when introducing a linking word to signal a transition.</li>
            </ul>

            <h4 class="mt-6">Example of Integrated Use</h4>
            <p><em>“First of all, I will explain the system architecture. Then, I will move on to the implementation details. Moreover, I will highlight the potential risks. Finally, I will summarise the benefits of our approach.”</em></p>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 mt-8">
              <h3 class="text-lg font-semibold text-blue-800">📝 Task: Linking Words Exercise</h3>
              <p class="text-blue-700 mb-4">Complete the following exercises to test your understanding of linking words.</p>
              <a href="/assignment/linking-words-assignment-1" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Start Task
              </a>
            </div>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'linking-words-assignment-1',
            title: 'Task 1: Linking Words Practice',
            description: 'Complete exercises on using linking words in different contexts',
            dueDate: '2025-10-10'
          }
        },
        {
          id: 5,
          title: 'Lesson 5 - Sentence Structure',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-5',
            title: 'Task 5: Sentence Structure Analysis',
            description: 'Analyze and construct different types of sentence structures',
            dueDate: '2025-10-11'
          }
        },
        {
          id: 6,
          title: 'Lesson 6 - Punctuation and Capitalization',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-6',
            title: 'Task 6: Punctuation Practice',
            description: 'Apply correct punctuation and capitalization rules',
            dueDate: '2025-10-12'
          }
        },
        {
          id: 7,
          title: 'Lesson 7 - Complex Sentence Patterns',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'grammar-assignment-7',
            title: 'Task 7: Complex Sentences Exercise',
            description: 'Create and analyze complex sentence patterns',
            dueDate: '2025-10-13'
          }
        }
      ]
    },
    'advanced-vocabulary': {
      id: 'advanced-vocabulary',
      title: 'Advanced Vocabulary',
      description: 'Expand your English vocabulary with advanced words and expressions',
      duration: '7 days',
      level: 'Advanced',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Academic Vocabulary',
          type: 'content',
          content: `
            <h4>Academic Vocabulary Essentials</h4>
            <p>Academic vocabulary forms the foundation of professional and scholarly communication. These words appear frequently in research papers, presentations, and formal discussions.</p>

            <h4 class="mt-4">Core Academic Terms</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Analyze:</strong> To examine in detail to understand structure or meaning.</li>
              <li><strong>Synthesize:</strong> To combine elements to form a coherent whole.</li>
              <li><strong>Evaluate:</strong> To assess the value, importance, or quality of something.</li>
              <li><strong>Hypothesis:</strong> A proposed explanation for a phenomenon.</li>
              <li><strong>Methodology:</strong> The systematic approach to research or problem-solving.</li>
            </ul>

            <h4 class="mt-6">Usage in Context</h4>
            <p><em>"To analyze the data effectively, we must first synthesize information from multiple sources. Our methodology allows us to evaluate each hypothesis systematically."</em></p>

            <h4 class="mt-6">Practice Tips</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Use academic vocabulary in professional emails and reports.</li>
              <li>Practice with synonyms to avoid repetition.</li>
              <li>Focus on precision over complexity.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-1',
            title: 'Task 1: Academic Vocabulary Practice',
            description: 'Complete exercises on academic vocabulary usage and context',
            dueDate: '2025-10-15'
          }
        },
        {
          id: 2,
          title: 'Lesson 2 - Workplace Jargon',
          type: 'content',
          content: `
            <ul class="space-y-3">
              <li>
                <p><strong>Backlog:</strong> A list of all the work a team needs to complete (features, bug fixes, tasks), prioritized for development.</p>
                <p><em>Example:</em> "We'll pick the next task from the backlog."</p>
              </li>
              <li>
                <p><strong>Bandwidth:</strong> A team's or individual's capacity to take on new work.</p>
                <p><em>Example:</em> "We don't have the bandwidth to add that feature this sprint."</p>
              </li>
              <li>
                <p><strong>Bottleneck:</strong> A point where the flow of work slows or halts due to constraints.</p>
                <p><em>Example:</em> "Code reviews are creating a bottleneck in our process."</p>
              </li>
              <li>
                <p><strong>Sprint:</strong> A short, fixed period (usually 1–4 weeks) for completing selected tasks from the backlog.</p>
                <p><em>Example:</em> "This sprint focuses on developing the payment feature."</p>
              </li>
              <li>
                <p><strong>Sync‑up:</strong> A quick meeting to align on status, progress, or plans.</p>
                <p><em>Example:</em> "Let's have a quick sync‑up before the client call."</p>
                <p><em>Example:</em> “The prototype didn’t work, so it’s back to the drawing board.”</p>
              </li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-2',
            title: 'Task 2: Workplace Jargon Exercise',
            description: 'Practice using workplace terminology in professional contexts',
            dueDate: '2025-10-16'
          }
        },
        {
          id: 2,
          title: 'Lesson 2 - Business English Terms',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-2b',
            title: 'Task 2: Business English Terms',
            description: 'Practice using business terminology in professional contexts',
            dueDate: '2025-10-16'
          }
        },
        {
          id: 3,
          title: 'Lesson 3 - Technical Vocabulary',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-3b',
            title: 'Task 3: Technical Vocabulary',
            description: 'Master technical terms used in various industries',
            dueDate: '2025-10-17'
          }
        },
        {
          id: 4,
          title: 'Lesson 4 - Idioms and Expressions',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-4b',
            title: 'Task 4: Idioms and Expressions',
            description: 'Learn and practice common English idioms and expressions',
            dueDate: '2025-10-18'
          }
        },
        {
          id: 5,
          title: 'Lesson 5 - Phrasal Verbs',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-5',
            title: 'Task 5: Phrasal Verbs Practice',
            description: 'Master common phrasal verbs and their meanings',
            dueDate: '2025-10-19'
          }
        },
        {
          id: 6,
          title: 'Lesson 6 - Problem-Solving & Troubleshooting Vocabulary',
          type: 'content',
          content: `
            <ul class="space-y-3">
              <li>
                <p><strong>Bug:</strong> An error or flaw in software that causes unexpected or incorrect results.</p>
                <p><em>Example:</em> “We need to fix this login bug before the next release.”</p>
              </li>
              <li>
                <p><strong>Debugging:</strong> The process of finding and fixing bugs in a program.</p>
                <p><em>Example:</em> “She spent the afternoon debugging the payment module.”</p>
              </li>
              <li>
                <p><strong>Root cause:</strong> The main underlying reason for a problem or issue.</p>
                <p><em>Example:</em> “The root cause of the crash was a memory leak.”</p>
              </li>
              <li>
                <p><strong>Workaround:</strong> A temporary solution to bypass a problem until a permanent fix is applied.</p>
                <p><em>Example:</em> “As a workaround, restart the server every two hours.”</p>
              </li>
              <li>
                <p><strong>Patch:</strong> A small update designed to fix bugs or vulnerabilities in software.</p>
                <p><em>Example:</em> “The security team released a patch for the critical vulnerability.”</p>
              </li>
              <li>
                <p><strong>Escalate:</strong> Transfer a problem to a higher level of support or authority when it can’t be resolved at the current level.</p>
                <p><em>Example:</em> “If the issue persists, we’ll escalate it to the senior developer.”</p>
              </li>
              <li>
                <p><strong>Troubleshoot:</strong> Systematically identify and solve problems using a step‑by‑step process.</p>
                <p><em>Example:</em> “Let’s troubleshoot the network connection before calling IT.”</p>
              </li>
              <li>
                <p><strong>Rollback:</strong> Revert a system, application, or codebase to a previous stable version.</p>
                <p><em>Example:</em> “We had to rollback the update because of unexpected errors.”</p>
              </li>
              <li>
                <p><strong>System crash:</strong> When a computer or application stops functioning completely and often requires a restart.</p>
                <p><em>Example:</em> “The server had a system crash during peak hours.”</p>
              </li>
              <li>
                <p><strong>Hotfix:</strong> An immediate, urgent software update that solves a specific critical problem.</p>
                <p><em>Example:</em> “The team deployed a hotfix to resolve the login issue overnight.”</p>
              </li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-6',
            title: 'Task 6: Problem-Solving Vocabulary',
            description: 'Practice troubleshooting and problem-solving terminology',
            dueDate: '2025-10-20'
          }
        },
        {
          id: 7,
          title: 'Lesson 7 - Advanced Writing Techniques',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-7',
            title: 'Task 7: Advanced Writing Practice',
            description: 'Apply advanced vocabulary in formal writing contexts',
            dueDate: '2025-10-21'
          }
        }
      ]
    },
    'business-english': {
      id: 'business-english',
      title: 'Business English',
      description: 'Professional English communication skills for the workplace',
      duration: '7 days',
      level: 'Intermediate',
      lessons: [
        {
          id: 1,
          title: 'Lesson 1 - Professional Email Writing',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-1a',
            title: 'Task 1: Email Writing Practice',
            description: 'Write professional emails for different business scenarios',
            dueDate: '2025-10-25'
          }
        },
        {
          id: 2,
          title: 'Lesson 2 - Meeting Participation',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-2',
            title: 'Task 2: Meeting Language Practice',
            description: 'Practice phrases and vocabulary for effective meeting participation',
            dueDate: '2025-10-26'
          }
        },
        {
          id: 3,
          title: 'Lesson 3 - Delivering Technical Presentations',
          type: 'content',
          content: `
            <h4>1. Clarity</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Use short, precise sentences.</li>
              <li>Avoid jargon unless essential; define terms immediately.</li>
              <li>Explain acronyms on first use (e.g., API = Application Programming Interface).</li>
              <li>Repeat key points for emphasis.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "The system uses a REST API (Representational State Transfer Application Programming Interface) so applications can communicate efficiently over the internet."</p>

            <h4 class="mt-6">2. Structure</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Plan: introduction → main points → conclusion.</li>
              <li>Use linking words: first of all, next, finally.</li>
              <li>Split content into clear sections.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "First of all, I’ll describe the architecture. Next, I’ll explain deployment. Finally, I’ll summarize the advantages."</p>

            <h4 class="mt-6">3. Guidance (Signposting)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Introduce sections: "Now, I’d like to move on to…"</li>
              <li>Highlight key points: "It’s important to note that…"</li>
              <li>Summarize before moving on: "So far, we’ve seen…"</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "Now, let’s move on to testing. It’s important to note that automated tests cover over 80% of the code."</p>

            <h4 class="mt-6">4. Support (Visual Aids)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Keep slides uncluttered; prefer bullet points, diagrams, and screenshots.</li>
              <li>Label diagrams clearly.</li>
              <li>Don’t read slides verbatim; use them as prompts.</li>
              <li>Use animations sparingly to highlight steps.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> Show a deployment flowchart while explaining each step.</p>

            <h4 class="mt-6">5. Engagement</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Ask rhetorical questions: "What happens if the server fails here?"</li>
              <li>Pause to let key points sink in.</li>
              <li>Summarize takeaways at the end of sections.</li>
              <li>Invite questions at suitable moments.</li>
            </ul>
            <p class="mt-2"><strong>Example:</strong> "To sum up, automating code review reduces errors significantly."</p>

            <h4 class="mt-6">Integrated Mini‑Presentation</h4>
            <p>"Good morning. Today, I’ll cover our automated testing framework. First, the architecture. Next, a live test run. It’s important to note this reduces manual testing by 50%. Now, dashboards for results. Finally, I’ll summarize benefits and take questions."</p>

            <h4 class="mt-6">Key Takeaways</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>Clarity</strong> makes your message understandable.</li>
              <li><strong>Structure</strong> organizes ideas logically.</li>
              <li><strong>Guidance</strong> helps the audience follow your flow.</li>
              <li><strong>Support</strong> with visuals reinforces key points.</li>
              <li><strong>Engagement</strong> keeps attention and invites interaction.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'vocabulary-assignment-3',
            title: 'Task 3: Scientific Vocabulary Quiz',
            description: 'Complete exercises on scientific and technical terminology',
            dueDate: '2025-10-17'
          }
        },
        {
          id: 4,
          title: 'Lesson 4 - Report Writing',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-4',
            title: 'Task 4: Business Report Writing',
            description: 'Create professional business reports with proper structure',
            dueDate: '2025-10-28'
          }
        },
        {
          id: 5,
          title: 'Lesson 5 - Customer Service Communication',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-5',
            title: 'Task 5: Customer Service Scenarios',
            description: 'Practice handling customer service situations professionally',
            dueDate: '2025-10-29'
          }
        },
        {
          id: 6,
          title: 'Lesson 6 - Cross-Cultural Communication',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-6',
            title: 'Task 6: Cross-Cultural Communication',
            description: 'Practice communicating effectively across different cultures',
            dueDate: '2025-10-30'
          }
        },
        {
          id: 7,
          title: 'Lesson 7 – Negotiation',
          type: 'content',
          content: `
            <p>Use clear, professional language to propose solutions, align expectations, and reach agreements.</p>

            <h4>1. Opening</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Let’s discuss how we can work this out.”</li>
              <li>“I’d like to explore possible solutions.”</li>
              <li>“Can we review the requirements together?”</li>
            </ul>

            <h4 class="mt-4">2. Proposals</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“What if we tried this approach instead?”</li>
              <li>“We could consider adjusting the timeline to…”</li>
              <li>“One option might be to…”</li>
            </ul>

            <h4 class="mt-4">3. Agreement (Full/Partial)</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“That sounds reasonable, but …”</li>
              <li>“I can work with that if we …”</li>
              <li>“We’re aligned on X; now let’s look at Y.”</li>
            </ul>

            <h4 class="mt-4">4. Polite Disagreement</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“I’m not sure that will work because …”</li>
              <li>“I understand your point, but we might face challenges with …”</li>
              <li>“That could be difficult to implement due to …”</li>
            </ul>

            <h4 class="mt-4">5. Clarifying / Summarizing</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Just to clarify, you’re suggesting … ?”</li>
              <li>“If I understand correctly, we agree on …”</li>
              <li>“Let’s make sure we’re on the same page regarding …”</li>
            </ul>

            <h4 class="mt-4">6. Closing</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>“Can we agree to move forward with this plan?”</li>
              <li>“Let’s document the agreed points and proceed.”</li>
              <li>“I think we have a workable solution.”</li>
            </ul>

            <h4 class="mt-4">Tips for Software Engineers</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li>Use neutral, professional language; avoid emotional phrasing.</li>
              <li>Focus on facts and solutions, not personalities.</li>
              <li>Pair phrases with technical rationale when discussing timelines, features, or resources.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-1',
            title: 'Task 1: Match Negotiation Phrases',
            description: 'Match negotiation phrases to their functions using drag-and-drop',
            dueDate: '2025-11-05'
          }
        },
        {
          id: 7,
          title: 'Lesson 7 - Business Writing',
          type: 'content',
          content: 'Content will be added here...',
          duration: '1 day',
          completed: false,
          task: {
            id: 'business-assignment-7',
            title: 'Task 7: Advanced Business Writing',
            description: 'Master advanced business writing techniques and formats',
            dueDate: '2025-10-31'
          }
        }
      ]
    }
  };

  // Load course data when component mounts or courseId changes
  useEffect(() => {
    const courseInfo = courseData[courseId];
    if (courseInfo) {
      setCourse(courseInfo);
      
      // Check for URL hash to select a specific lesson
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const lesson = courseInfo.lessons.find(l => l.id.toString() === hash);
        if (lesson) {
          setSelectedLesson(lesson);
          return;
        }
      }
      
      // Set the first lesson as selected by default if no hash
      if (courseInfo.lessons && courseInfo.lessons.length > 0) {
        setSelectedLesson(courseInfo.lessons[0]);
      }
      
      // Calculate progress
      const completedLessons = courseInfo.lessons.filter(lesson => lesson.completed).length;
      const progressPercentage = (completedLessons / courseInfo.lessons.length) * 100;
      setProgress(progressPercentage);
    }
  }, [courseId]);

  const handleLessonComplete = (lessonId) => {
    const updatedCourse = { ...course };
    const lesson = updatedCourse.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.completed = true;
      setCourse(updatedCourse);
      
      // Recalculate progress
      const completedLessons = updatedCourse.lessons.filter(l => l.completed).length;
      const progressPercentage = (completedLessons / updatedCourse.lessons.length) * 100;
      setProgress(progressPercentage);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
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
                English LMS
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentUser?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>⏱️ {course.duration}</span>
                <span>📊 {course.level}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-primary-100 border-2 border-primary-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                      <div className="ml-2">
                        {lesson.completed ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Render lesson tasks inline */}
                {course.lessons.map((lesson) => {
                  // Single task
                  if (lesson.task) {
                    return (
                      <div key={`task-${lesson.id}`} className="ml-4 mt-2">
                        <Link
                          to={`/assignment/${lesson.task.id}`}
                          className="block w-full text-left p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-blue-900 text-xs mb-1">
                                {lesson.task.title}
                              </h5>
                              <p className="text-xs text-blue-600">Due: {lesson.task.dueDate}</p>
                            </div>
                            <div className="ml-2">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  }
                  // Multiple tasks
                  if (lesson.tasks && lesson.tasks.length > 0) {
                    return (
                      <div key={`tasks-${lesson.id}`} className="ml-4 mt-2 space-y-1">
                        {lesson.tasks.map((task) => (
                          <Link
                            key={task.id}
                            to={`/assignment/${task.id}`}
                            className="block w-full text-left p-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-green-900 text-xs mb-1">
                                  {task.title}
                                </h5>
                                <p className="text-xs text-green-600">Due: {task.dueDate}</p>
                              </div>
                              <div className="ml-2">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {selectedLesson && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-gray-600">Duration: {selectedLesson.duration}</p>
                    
                    {/* Show lesson tasks */}
                    {selectedLesson.task && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Lesson Task</h4>
                        <Link
                          to={`/assignment/${selectedLesson.task.id}`}
                          className="text-blue-700 hover:text-blue-800 font-medium text-sm"
                        >
                          {selectedLesson.task.title} →
                        </Link>
                        <p className="text-xs text-blue-600 mt-1">Due: {selectedLesson.task.dueDate}</p>
                      </div>
                    )}
                    
                    {selectedLesson.tasks && selectedLesson.tasks.length > 0 && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-green-900 mb-2">Lesson Tasks</h4>
                        <div className="space-y-2">
                          {selectedLesson.tasks.map((task) => (
                            <div key={task.id}>
                              <Link
                                to={`/assignment/${task.id}`}
                                className="text-green-700 hover:text-green-800 font-medium text-sm"
                              >
                                {task.title} →
                              </Link>
                              <p className="text-xs text-green-600">Due: {task.dueDate}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {!selectedLesson.completed && (
                    <button
                      onClick={() => handleLessonComplete(selectedLesson.id)}
                      className="btn-primary"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6">
                    {selectedLesson.content === 'Content will be added here...' ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Lesson Content</h3>
                        <p className="text-gray-600 mb-4">
                          Content for this lesson will be added soon.
                        </p>
                        <div className="text-sm text-gray-500">
                          <p>📝 This area will display the lesson content including text, tables, and other educational materials.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link 
                      to={`/notes/${course.id}/${selectedLesson.id}`}
                      className="btn-secondary"
                    >
                      📝 Take Notes
                    </Link>
                    <Link 
                      to={`/discussion/${course.id}`}
                      className="btn-secondary"
                    >
                      💬 Discussion
                    </Link>
                  </div>
                  
                  {selectedLesson.completed && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Lesson Completed
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
