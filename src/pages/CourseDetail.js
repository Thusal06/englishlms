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
        if (lesson.tasks && lesson.tasks.length > 0) {
          lesson.tasks.forEach((t) => {
            addAssignment({
              id: t.id,
              title: t.title,
              description: t.description,
              courseId: course.id,
              courseName: course.title,
              lessonId: lesson.id,
              lessonName: lesson.title,
              dueDate: t.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'pending',
              createdAt: new Date().toISOString()
            });
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
          title: 'Lesson 1 - Articles',
          type: 'content',
          content: `
            <h3>What Are Articles?</h3>
            <p>Articles are small words placed before nouns to define whether the noun is specific or general. The three articles in English are:</p>
            <ul class="list-disc pl-6">
              <li><strong>a</strong> (indefinite article)</li>
              <li><strong>an</strong> (indefinite article, used before vowel sounds)</li>
              <li><strong>the</strong> (definite article)</li>
            </ul>

            <h4 class="mt-4">Using Articles Correctly</h4>
            <h5 class="mt-2 font-semibold">1. The Indefinite Articles: 'a' and 'an'</h5>
            <p>Use 'a' before words beginning with a consonant sound.</p>
            <p><em>Example:</em> a bug, a server, a feature</p>
            <p class="mt-2">Use 'an' before words beginning with a vowel sound.</p>
            <p><em>Example:</em> an error, an update, an interface</p>
            <p class="mt-2">When to Use 'a' or 'an':</p>
            <ul class="list-disc pl-6">
              <li>When mentioning something for the first time or something nonspecific.</li>
              <li>When referring to one item or unit (singular countable noun).</li>
            </ul>

            <h5 class="mt-4 font-semibold">2. The Definite Article: 'the'</h5>
            <p>Use 'the' when referring to something specific or previously mentioned or when both speaker and listener know what is being discussed.</p>
            <p><em>Example:</em> “I found an error in the report.” → “The error is on page 5.”</p>
            <p>Use before unique things or when the noun is clear from context. <em>“Please restart the server.”</em></p>

            <h5 class="mt-4 font-semibold">3. Zero Article (No Article)</h5>
            <p>No article is used before plural or uncountable nouns when talking about things in general.</p>
            <p><em>Examples:</em> “We fixed bugs yesterday.” “Software development requires testing.”</p>

            <h4 class="mt-6">Common Mistakes in Using Articles</h4>
            <ul class="list-disc pl-6">
              <li>Using <em>a</em> or <em>an</em> with uncountable nouns (e.g., information, advice).</li>
              <li>Omitting <em>the</em> when the noun is already specified or known.</li>
              <li>Using <em>the</em> unnecessarily before general, plural, or uncountable nouns.</li>
            </ul>

            <h4 class="mt-6">Examples</h4>
            <ul class="list-disc pl-6">
              <li>There is <strong>a</strong> bug in the system.</li>
              <li>I need <strong>an</strong> update on the project status.</li>
              <li>Did you check <strong>the</strong> server logs?</li>
              <li><strong>Bugs</strong> need to be fixed before release.</li>
              <li><strong>Information</strong> is stored securely.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            {
              id: 'articles-task-1',
              title: 'Task 1: Articles – Fill the Blanks',
              description: 'Fill each blank with a, an, the, or leave it blank if no article is needed.',
              dueDate: '2025-10-05'
            },
            {
              id: 'articles-task-2',
              title: 'Task 2: Articles – Paragraph Completion',
              description: 'Complete the engineer’s report with correct articles.',
              dueDate: '2025-10-06'
            },
            {
              id: 'articles-task-3',
              title: 'Task 3: Articles – Choose the Correct Option',
              description: 'Choose the correct article to complete each sentence.',
              dueDate: '2025-10-07'
            }
          ]
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
          title: 'Lesson 3 - Modal Verbs',
          type: 'content',
          content: `
            <h3>Modal Verbs</h3>
            <p>Modal verbs are special auxiliary verbs that express possibility, ability, permission, necessity, or obligation. They are always followed by the base form of a verb (without “to”).</p>
            <h4 class="mt-4">Common Modal Verbs</h4>
            <ul class="list-disc pl-6">
              <li><strong>Can / Could</strong> → ability, possibility, permission</li>
              <li><strong>May / Might</strong> → possibility, permission</li>
              <li><strong>Must</strong> → necessity, strong obligation, deduction</li>
              <li><strong>Shall / Should</strong> → advice, suggestions, mild obligation</li>
              <li><strong>Will / Would</strong> → future, willingness, polite requests</li>
              <li><strong>Have to / Ought to</strong> → necessity, duty</li>
            </ul>
            <h4 class="mt-4">Examples</h4>
            <ul class="list-disc pl-6">
              <li>Ability: She <em>can</em> code in Java.</li>
              <li>Possibility: This bug <em>might</em> cause delays.</li>
              <li>Obligation: You <em>must</em> submit the report by tomorrow.</li>
              <li>Advice: We <em>should</em> test this feature before release.</li>
              <li>Permission: You <em>may</em> leave early today.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            {
              id: 'modal-verbs-task-1',
              title: 'Task 1: Modal Verbs – Fill the Blanks',
              description: 'Fill in the blanks with the correct modal verb based on context.',
              dueDate: '2025-10-09'
            }
          ]
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
          title: 'Lesson 5 - Reported Speech',
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
          title: 'Lesson 6 - Asking Questions Professionally',
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
          title: 'Lesson 7 - Clarification Techniques',
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
          title: 'Lesson 2 - Hedgings',
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
          title: 'Lesson 3 - Cross-Cultural Communication Phrases',
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
          title: 'Lesson 4 - Customer Service and Client Interaction Phrases',
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
          title: 'Lesson 5 - Collaboration & Teamwork in Software Engineering',
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
          title: 'Lesson 2 - Participating in Stand-up Meetings',
          type: 'content',
          content: `
            <h3>What is a Stand-up Meeting?</h3>
            <p>Stand-up meetings are short, daily team discussions (usually 10–15 minutes). They are common in workplaces, especially in software development and project-based environments. The main purpose is to share quick updates, identify challenges, and keep everyone aligned.</p>
            <p>Each participant usually answers three key questions:</p>
            <ul class="list-disc pl-6">
              <li><strong>What did I do yesterday?</strong> <em>(Past Simple)</em> – Completed actions. Example: I finished writing the test cases.</li>
              <li><strong>What am I doing today?</strong> <em>(Present Continuous)</em> – Ongoing work. Example: I am reviewing the new feature design.</li>
              <li><strong>Are there any blockers?</strong> – Problems or issues that stop progress. Example: I cannot continue until I get approval from the manager.</li>
            </ul>

            <h3 class="mt-6">Purpose of a Stand-up Meeting</h3>
            <ul class="list-disc pl-6">
              <li><strong>Information Sharing</strong> – Everyone knows what the team is working on.</li>
              <li><strong>Coordination</strong> – Identify overlaps and dependencies in tasks.</li>
              <li><strong>Problem Solving</strong> – Expose blockers early so the team can fix them.</li>
              <li><strong>Team Building</strong> – Encourages collaboration and responsibility.</li>
            </ul>

            <h3 class="mt-6">Key Principles for Effective Stand-up Participation</h3>
            <h4 class="mt-3">1. Conciseness → Speak briefly, no long explanations.</h4>
            <ul class="list-disc pl-6">
              <li>Stand-ups are short (≈15 minutes total).</li>
              <li>Each person speaks for ~30–60 seconds.</li>
              <li>Avoid unnecessary background stories.</li>
            </ul>
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 my-3 rounded-r">
              <p><strong>Example:</strong> “Yesterday I worked on fixing the login issue.”</p>
            </div>
            <p><em>Why?</em> It saves time and keeps the meeting productive.</p>

            <h4 class="mt-3">2. Clarity → Use simple, direct sentences.</h4>
            <ul class="list-disc pl-6">
              <li>Use short, complete sentences; avoid vague language.</li>
              <li>Be specific: “I tested the checkout page.”</li>
            </ul>
            <p><em>Why?</em> Clear updates prevent confusion and help track progress.</p>

            <h4 class="mt-3">3. Collaboration → Focus on team goals.</h4>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-3 my-3 rounded-r">
              <p><strong>Example:</strong> “I finished the report, so the design team can use the data.”</p>
            </div>

            <h4 class="mt-3">4. Politeness → Acknowledge others and respect time.</h4>
            <ul class="list-disc pl-6">
              <li>Wait your turn; don’t interrupt.</li>
              <li>Use polite language for blockers: “I need help with …”.</li>
              <li>Thank others and keep within time limits.</li>
            </ul>

            <h3 class="mt-6">Benefits</h3>
            <ul class="list-disc pl-6">
              <li>Builds professional English fluency.</li>
              <li>Improves teamwork and responsibility.</li>
              <li>Enhances problem-solving by sharing blockers.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-standup-task-1', title: 'Task 1: Match Stand-up Qs ↔ Answers', description: 'Match each stand-up question with the correct answers.', dueDate: '2025-11-01' },
            { id: 'be-standup-task-2', title: 'Task 2: Verb Forms in Stand-ups', description: 'Complete sentences using Past Simple, Present Continuous, or Present Simple.', dueDate: '2025-11-02' },
            { id: 'be-standup-task-3', title: 'Task 3: Vocabulary Matching', description: 'Match the word/phrase with its meaning.', dueDate: '2025-11-03' },
            { id: 'be-standup-task-4', title: 'Task 4: Reading – True/False', description: 'Read the dialogue and mark statements True/False.', dueDate: '2025-11-04' }
          ]
        },
        {
          id: 3,
          title: 'Lesson 3 - Delivering Technical Presentations',
          type: 'content',
          content: `
            <h3>1. Clarity</h3>
            <p><strong>Definition:</strong> Make your message easy to understand. Avoid unnecessary jargon; define technical terms immediately.</p>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Example:</strong> “The system uses a REST API (Representational State Transfer Application Programming Interface). This allows applications to communicate efficiently over the internet.”</p>
            </div>

            <h3 class="mt-6">2. Structure</h3>
            <p><strong>Definition:</strong> Organize ideas logically using linking words.</p>
            <ul class="list-disc pl-6">
              <li>Introduction → main points → conclusion</li>
              <li>Use: first of all, next, finally</li>
            </ul>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Example:</strong> “First of all, I will describe the architecture. Then, I will explain the deployment process. Finally, I will summarize the advantages.”</p>
            </div>

            <h3 class="mt-6">3. Guidance</h3>
            <p><strong>Definition:</strong> Signposting to orient the audience.</p>
            <ul class="list-disc pl-6">
              <li>“Now, I’d like to move on to …”</li>
              <li>“It is important to note that …”</li>
              <li>“So far, we have seen …”</li>
            </ul>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Example:</strong> “Now, let’s move on to the system testing phase. It is important to note that automated tests cover over 80% of the code.”</p>
            </div>

            <h3 class="mt-6">4. Support</h3>
            <p><strong>Definition:</strong> Visual aids (slides, diagrams, charts) reinforce spoken content.</p>
            <ul class="list-disc pl-6">
              <li>Keep slides uncluttered; label diagrams clearly; avoid reading slides verbatim.</li>
            </ul>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Example:</strong> Show a deployment pipeline flowchart while explaining steps.</p>
            </div>

            <h3 class="mt-6">5. Engagement</h3>
            <p><strong>Definition:</strong> Keep the audience interested and invite interaction.</p>
            <ul class="list-disc pl-6">
              <li>Ask rhetorical questions, pause for emphasis, summarize takeaways, invite questions.</li>
            </ul>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Example:</strong> “To sum up, automating code review reduces errors significantly. How much time could your team save if most errors are caught before deployment?”</p>
            </div>

            <h3 class="mt-6">Integrated Example – Short Technical Presentation</h3>
            <p>“Good morning, everyone. Today, I’ll be talking about our automated testing framework. First of all, I will explain the architecture. Then, I will demonstrate a live test run. It is important to note that this framework reduces manual testing by 50%. Now, let’s move on to how we analyze the results using dashboards. Finally, I’ll summarize the benefits and answer your questions.”</p>

            <h3 class="mt-6">Key Takeaways</h3>
            <ul class="list-disc pl-6">
              <li>Clarity ensures your message is understandable.</li>
              <li>Structure and linking words organize content logically.</li>
              <li>Guidance via signposting helps audience follow your flow.</li>
              <li>Support with visual aids reinforces key points.</li>
              <li>Engagement keeps your audience attentive and interactive.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-presentations-task-1', title: 'Task 1: 3-minute Technical Presentation (Video)', description: 'Record and upload a 3-minute technical presentation.', dueDate: '2025-11-06' }
          ]
        },
        {
          id: 4,
          title: 'Lesson 4 - Understanding Business Etiquette and Cultural Nuances',
          type: 'content',
          content: `
            <h3>Why This Matters</h3>
            <p>In a global software engineering environment, understanding both business etiquette and cultural nuances is essential for effective communication and successful teamwork.</p>
            <h4 class="mt-4">1. Punctuality and Time Perception</h4>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <ul class="list-disc pl-6">
                <li>“I will join the meeting promptly at 10 AM.”</li>
                <li>“Please let me know if the meeting time changes.”</li>
                <li>“I apologize for the delay due to technical difficulties.”</li>
                <li>“Sorry for joining late; thank you for your patience.”</li>
                <li>“The deadline is firm and must be met by Friday.”</li>
                <li>“We will aim to complete this by Friday, though delays might occur.”</li>
              </ul>
            </div>
            <p><em>Language Tip:</em> Use modal verbs like will, could, would to express commitment or polite requests.</p>
            <h4 class="mt-4">2. Communication Style</h4>
            <div class="bg-gray-50 border rounded p-3 my-3">
              <p><strong>Direct & Low-context:</strong> “The report needs corrections before Friday.”</p>
              <p><strong>Indirect & High-context:</strong> “It might be helpful to review the report again before Friday.”</p>
              <p><strong>Polite Disagreement:</strong> “I understand your point; however …”</p>
            </div>
            <h4 class="mt-4">3. Email Etiquette and Politeness</h4>
            <ul class="list-disc pl-6">
              <li>Greetings: “Dear [Name],” / “Hello [Name], I hope you are well.”</li>
              <li>Requests: “Could you please …” / “Would you mind …”</li>
              <li>Thanks: “Thank you for your support.”</li>
              <li>Closings: “Best regards,” / “Kind regards,”</li>
            </ul>
            <h4 class="mt-4">4. Meeting Behavior and Turn-Taking</h4>
            <ul class="list-disc pl-6">
              <li>Asking to speak: “May I add something here?”</li>
              <li>Agreement: “I agree with your point.”</li>
              <li>Disagreement: “I see it differently because …”</li>
            </ul>
            <h4 class="mt-4">5. Titles, Hierarchy, and Respect</h4>
            <p>Begin formally and adjust based on cues (e.g., Mr./Dr. vs first names).</p>
            <h4 class="mt-4">6. Approaching Conflict and Criticism</h4>
            <p>Direct: “This report needs improvement …” Indirect: “There might be some areas to improve.”</p>
            <h4 class="mt-4">7. Non-Verbal Communication</h4>
            <ul class="list-disc pl-6">
              <li>Eye contact norms vary; be mindful of tone and gestures.</li>
              <li>Politeness: “Thank you for your understanding.” / “I appreciate your patience.”</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-etiquette-task-1', title: 'Task 1: Etiquette – MCQ', description: 'Choose the best option for each question.', dueDate: '2025-11-08' },
            { id: 'be-etiquette-task-2', title: 'Task 2: Etiquette – Fill in the Blanks', description: 'Complete each sentence with a suitable word from the box.', dueDate: '2025-11-09' },
            { id: 'be-etiquette-task-3', title: 'Task 3: Phrase → Purpose (Match)', description: 'Match each phrase to its communicative purpose.', dueDate: '2025-11-10' },
            { id: 'be-etiquette-task-4', title: 'Task 4: True or False', description: 'Determine whether each statement is true or false.', dueDate: '2025-11-11' }
          ]
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
                Techlish
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
                        
                        {/* Task section at the end of lesson content */}
                        {selectedLesson.task && (
                          <div className="not-prose mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                              📝 Task {selectedLesson.id}: {selectedLesson.task.title.replace(/^Task \d+: /, '')}
                            </h3>
                            <p className="text-blue-700 mb-4">{selectedLesson.task.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-600">Due: {selectedLesson.task.dueDate}</span>
                              <Link
                                to={`/assignment/${selectedLesson.task.id}`}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                              >
                                Start Task
                              </Link>
                            </div>
                          </div>
                        )}
                        {selectedLesson.tasks && selectedLesson.tasks.length > 0 && (
                          <div className="not-prose mt-8 space-y-4">
                            {selectedLesson.tasks.map((t, idx) => (
                              <div key={t.id} className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">📝 Task {idx + 1}: {t.title.replace(/^Task \d+: /, '')}</h3>
                                <p className="text-green-700 mb-2">{t.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-green-700">Due: {t.dueDate}</span>
                                  <Link to={`/assignment/${t.id}`} className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Start Task</Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
