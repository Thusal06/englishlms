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
          title: 'Lesson 2 - Tenses',
          type: 'content',
          content: `
            <h3>Lesson 2 - Tenses</h3>
            <h4 class="mt-4">Past Tense</h4>
            <div class="bg-gray-50 border rounded p-4 mb-4">
              <ul class="list-disc pl-6">
                <li><strong>Use:</strong> To talk about actions that happened and finished in the past.</li>
                <li><strong>Form:</strong> Subject + Verb (past form) + Object.</li>
              </ul>
              <div class="mt-2">
                <p class="text-gray-800"><em>Examples:</em></p>
                <ul class="list-disc pl-6">
                  <li>She <strong>completed</strong> the project yesterday.</li>
                  <li>They <strong>attended</strong> the meeting last week.</li>
                </ul>
              </div>
            </div>

            <h4>Simple Present Tense</h4>
            <div class="bg-gray-50 border rounded p-4 mb-4">
              <ul class="list-disc pl-6">
                <li><strong>Use:</strong> To describe habits, facts, routines, and general truths.</li>
                <li><strong>Form:</strong> Subject + Verb (base form / -s for he, she, it) + Object.</li>
              </ul>
              <div class="mt-2">
                <p class="text-gray-800"><em>Examples:</em></p>
                <ul class="list-disc pl-6">
                  <li>He <strong>writes</strong> emails every morning.</li>
                  <li>The system <strong>runs</strong> smoothly.</li>
                </ul>
              </div>
            </div>

            <h4>Future Tense</h4>
            <div class="bg-gray-50 border rounded p-4 mb-4">
              <ul class="list-disc pl-6">
                <li><strong>Use:</strong> To talk about actions that will happen in the future.</li>
                <li><strong>Form:</strong> Subject + will + Verb (base form) + Object.</li>
              </ul>
              <div class="mt-2">
                <p class="text-gray-800"><em>Examples:</em></p>
                <ul class="list-disc pl-6">
                  <li>They <strong>will organize</strong> a workshop next week.</li>
                  <li>I <strong>will join</strong> the call tomorrow.</li>
                </ul>
              </div>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'grammar-tenses-task-1', title: 'Task 1: Past Tense – Word Bank Fill', description: 'Fill in the blanks with the correct past tense form from the box.', dueDate: '2025-11-20' },
            { id: 'grammar-tenses-task-2', title: 'Task 2: Past Tense – Write the Form', description: 'Type the correct past tense of the given verbs.', dueDate: '2025-11-21' },
            { id: 'grammar-tenses-task-3', title: 'Task 3: Future Tense – Rearrange Words', description: 'Rearrange the words to make correct future tense sentences.', dueDate: '2025-11-22' },
            { id: 'grammar-tenses-task-4', title: 'Task 4: Future Tense – Will + Verb', description: 'Fill in the blanks with the correct future tense form (will + verb).', dueDate: '2025-11-23' },
            { id: 'grammar-tenses-task-5', title: 'Task 5: Present Simple – Choose the Form', description: 'Choose the correct present simple verb form.', dueDate: '2025-11-24' }
          ]
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
            id: 'grammar-assignment-1',
            title: 'Task 1: Linking Words Quiz (with Audio)',
            description: 'Listen to the audio and complete the questions. Audio can be played up to 3 times.',
            dueDate: '2025-10-10'
          }
        },
        {
          id: 5,
          title: 'Lesson 5 - Teamwork and leadership communication',
          type: 'content',
          content: `
            <div class="bg-gray-50 border rounded p-4">
              <p>Good teamwork and leadership depend on <strong>clear, respectful, and motivating communication</strong>.</p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Encourage collaboration</strong> → Use inclusive language like “Let’s work on this together.”</li>
                <li><strong>Delegate tasks clearly</strong> → Assign roles and responsibilities without confusion.</li>
                <li><strong>Motivate your team</strong> → Recognize effort and achievements to build confidence.</li>
                <li><strong>Invite input and feedback</strong> → Value everyone’s ideas and promote open discussion.</li>
                <li><strong>Keep the team positive and focused</strong> → Guide conversations toward solutions instead of problems.</li>
              </ul>
              <p class="mt-3">Strong communication builds trust, improves efficiency, and helps a team achieve common goals.</p>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-teamwork-task-1', title: 'Task 1: Leadership Communication – Complete the Sentences', description: 'Choose the correct letter (A–E) to complete each sentence.', dueDate: '2025-11-16' },
            { id: 'be-teamwork-task-2', title: 'Task 2: Phrase → Purpose (Leadership)', description: 'Match the leadership communication phrase to the correct purpose.', dueDate: '2025-11-17' }
          ]
        },
        {
          id: 6,
          title: 'Lesson 6 - Report Writing',
          type: 'content',
          content: `
            <p>In the software industry, report writing is an essential business communication skill. Reports document work clearly and professionally for managers, clients, and stakeholders, supporting decision‑making, planning, and accountability.</p>
            <h4 class="mt-4">Purpose of Report Writing</h4>
            <ul class="list-disc pl-6">
              <li>Present project progress and performance updates.</li>
              <li>Document testing results or bug‑tracking logs.</li>
              <li>Recommend solutions for technical or organisational issues.</li>
              <li>Record research, feasibility studies, or case analyses.</li>
            </ul>
            <p class="mt-2">Unlike informal communication, reports follow a structured format that makes information easy to follow.</p>
            <h4 class="mt-4">Structure of a Business/Technical Report</h4>
            <ul class="list-disc pl-6">
              <li><strong>Title Page/Heading</strong> – Identifies the report.</li>
              <li><strong>Introduction</strong> – Purpose, scope, and objectives.</li>
              <li><strong>Background/Problem Statement</strong> – Necessary context.</li>
              <li><strong>Findings/Analysis</strong> – Facts, data, test results, observations.</li>
              <li><strong>Discussion</strong> – Interpret results and implications.</li>
              <li><strong>Recommendations/Conclusion</strong> – Solutions or next steps.</li>
            </ul>
            <h4 class="mt-4">Qualities of an Effective Report</h4>
            <ul class="list-disc pl-6">
              <li><strong>Clarity</strong> – Simple, direct language.</li>
              <li><strong>Concise</strong> – Short, relevant sentences.</li>
              <li><strong>Objectivity</strong> – Evidence‑based conclusions.</li>
              <li><strong>Organisation</strong> – Logical sequence with headings.</li>
              <li><strong>Professional Tone</strong> – Formal and polite style.</li>
            </ul>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r">
              <h5 class="font-semibold">Importance for Software Engineers</h5>
              <ul class="list-disc pl-6 mt-1">
                <li>Clear updates across technical and non‑technical teams.</li>
                <li>Testing/debugging processes documented for future reference.</li>
                <li>Managers and clients can trust and act on the information.</li>
                <li>Professional credibility through well‑structured documentation.</li>
              </ul>
              <p class="mt-2">Good report writing is as critical as good coding—both contribute to project success.</p>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-reportwriting-task-1', title: 'Task 1: Report Writing – MCQ', description: 'Select the correct answers about report writing.', dueDate: '2025-11-22' },
            { id: 'be-reportwriting-task-2', title: 'Task 2: Report Writing – Fill in the Blanks', description: 'Complete the sentences with the correct terms.', dueDate: '2025-11-23' },
            { id: 'be-reportwriting-task-3', title: 'Task 3: Report Writing – True/False', description: 'Decide if each statement is true or false.', dueDate: '2025-11-24' }
          ]
        },
        {
          id: 7,
          title: 'Lesson 7 - Clarification Techniques',
          type: 'content',
          content: `
            <p>In software projects, clear communication is just as important as writing clean code. Misunderstandings can lead to bugs, delays, or wrong deliveries. That’s why clarification techniques are essential.</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Avoid errors in requirements or tasks.</li>
              <li>Save time by confirming details immediately.</li>
              <li>Ensure teamwork by showing respect and active listening.</li>
              <li>Build professionalism in client and cross-team discussions.</li>
            </ul>

            <h4 class="mt-4">Key Techniques in Software Communication</h4>
            <h5 class="font-semibold mt-2">Indirect Questions</h5>
            <p>Used when asking for more explanation politely.</p>
            <ul class="list-disc pl-6">
              <li>“Could you explain what you mean by ‘optimizing the API’?”</li>
              <li>“Would you mind going over the error handling process again?”</li>
            </ul>

            <h5 class="font-semibold mt-3">Paraphrasing to Confirm</h5>
            <p>Restating in your own words to check understanding.</p>
            <ul class="list-disc pl-6">
              <li>“So, you mean the login bug only happens in Firefox, right?”</li>
              <li>“If I understand correctly, we should deploy to staging first, then to production?”</li>
            </ul>

            <h5 class="font-semibold mt-3">Softening Phrases</h5>
            <p>Make requests polite and less direct, useful in team settings.</p>
            <ul class="list-disc pl-6">
              <li>“I’m sorry, I didn’t quite catch the last part about the database migration.”</li>
              <li>“Could you please repeat the file path?”</li>
            </ul>

            <h5 class="font-semibold mt-3">Asking for Examples</h5>
            <p>Clarify by requesting real cases or sample data.</p>
            <ul class="list-disc pl-6">
              <li>“Could you give me an example of the kind of input that causes this bug?”</li>
              <li>“Can you show me how the client wants the dashboard to look?”</li>
            </ul>

            <h5 class="font-semibold mt-3">Checking Key Details</h5>
            <p>Confirm technical facts like deadlines, version numbers, or configurations.</p>
            <ul class="list-disc pl-6">
              <li>“Just to confirm, we are using Java 17 for this project, correct?”</li>
              <li>“Did you say the deadline is Friday evening or Monday morning?”</li>
            </ul>

            <h5 class="font-semibold mt-3">Summarizing</h5>
            <p>Summarize the key point to make sure the team is aligned.</p>
            <ul class="list-disc pl-6">
              <li>“So, the plan is: fix the login bug, update the test cases, and then push to GitHub, correct?”</li>
              <li>“To summarize, the next sprint will focus on API performance, right?”</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'grammar-clarification-task-a', title: 'Task A: Match Technique → Example', description: 'Match each clarification technique with the correct example sentence.', dueDate: '2025-11-26' },
            { id: 'grammar-clarification-task-b', title: 'Task B: Fill in the Clarification Phrase', description: 'Complete the sentences with a suitable clarification phrase.', dueDate: '2025-11-27' },
            { id: 'grammar-clarification-task-c', title: 'Task C: Vocabulary Match', description: 'Match the term with its meaning from the reading.', dueDate: '2025-11-28' },
            { id: 'grammar-clarification-task-d', title: 'Task D: Complete with the Correct Word', description: 'Fill in the blanks with the correct word from the box.', dueDate: '2025-11-29' }
          ]
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
          title: 'Lesson 1 - Workplace Jargon',
          type: 'content',
          content: `
            <p>Workplace jargon refers to the special words and expressions used in professional environments. Knowing these terms helps software engineers and other professionals communicate effectively in meetings, projects, and team discussions.</p>
            <ol class="list-decimal pl-6 space-y-2 mt-3">
              <li><strong>Backlog</strong> – A list of all the work that a team needs to complete, including features, bug fixes, and other tasks, prioritized for development.<br/><em>Example:</em> “We’ll pick the next task from the backlog.”</li>
              <li><strong>Bandwidth</strong> – Refers to a team’s or individual’s capacity to take on new work.<br/><em>Example:</em> “We don’t have the bandwidth to add that feature this sprint.”</li>
              <li><strong>Black Economy</strong> – Economic activity that is unrecorded and untaxed by the government, often linked to informal or illegal transactions.<br/><em>Example:</em> “Some freelance jobs done without invoices contribute to the black economy.”</li>
              <li><strong>Blow-by-blow</strong> – A detailed, step-by-step account of an event or process.<br/><em>Example:</em> “The team lead gave us a blow-by-blow explanation of the release issue.”</li>
              <li><strong>Bottleneck</strong> – A point where the flow of work slows or halts due to constraints.<br/><em>Example:</em> “Code reviews are creating a bottleneck in our process.”</li>
              <li><strong>Go-to-Market (GTM)</strong> – The strategy a company uses to launch a new product or service, covering marketing, sales, distribution, and pricing.<br/><em>Example:</em> “The go-to-market plan for our app targets small businesses first.”</li>
              <li><strong>Onboarding</strong> – The process of welcoming and integrating a new employee into the company and team.<br/><em>Example:</em> “The onboarding program includes training sessions and mentorship.”</li>
              <li><strong>Stand-up</strong> – A short, daily team meeting where members share updates, plans, and blockers.<br/><em>Example:</em> “During today’s stand-up, I’ll update on the bug fix progress.”</li>
              <li><strong>Sprint</strong> – A short, fixed period (usually 1–4 weeks) in which a team completes a set of tasks from the backlog.<br/><em>Example:</em> “This sprint focuses on developing the payment feature.”</li>
              <li><strong>Sync-up</strong> – A meeting or discussion to align the team on project status, progress, or plans.<br/><em>Example:</em> “Let’s have a quick sync-up before the client call.”</li>
              <li><strong>Back to the Drawing Board</strong> – An expression meaning to start over after a failed or flawed attempt.<br/><em>Example:</em> “The prototype didn’t work, so it’s back to the drawing board.”</li>
            </ol>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-workplace-jargon-task-1', title: 'Task 1: Workplace Jargon – Word Bank Fill', description: 'Complete each sentence with the correct term from the box.', dueDate: '2025-10-15' },
            { id: 'av-workplace-jargon-task-2', title: 'Task 2: Workplace Jargon – Finish the Sentences', description: 'Finish each sentence using your own ideas with the given term.', dueDate: '2025-10-16' }
          ]
        },
        {
          id: 2,
          title: 'Lesson 2 - Hedgings',
          type: 'content',
          content: `
            <h4>What Are Hedgings?</h4>
            <p>Hedgings are grammatical devices used to soften statements, make them less direct, or express uncertainty. They help make communication more polite and collaborative, especially useful in giving feedback or making suggestions in international or professional settings.</p>

            <h4 class="mt-4">Forms of Hedging</h4>
            <h5 class="font-semibold mt-2">1. Modal Verbs for Hedging</h5>
            <p>Modal verbs such as <em>might, may, could, would, should</em> express possibility, permission, or polite requests.</p>
            <p class="mt-1"><strong>Possibility:</strong></p>
            <ul class="list-disc pl-6">
              <li>“The server might be down.”</li>
              <li>“This could cause delays.”</li>
            </ul>
            <p class="mt-1"><strong>Polite Requests:</strong></p>
            <ul class="list-disc pl-6">
              <li>“Could you please check the code?”</li>
              <li>“Would you review this document?”</li>
            </ul>

            <h5 class="font-semibold mt-3">2. Adverbs and Adjectives for Hedging</h5>
            <p>Words like <em>perhaps, maybe, somewhat, rather, possibly, apparently</em> add uncertainty or soften the tone.</p>
            <ul class="list-disc pl-6">
              <li>“Perhaps we should restart the application.”</li>
              <li>“The system is somewhat slow during high traffic.”</li>
              <li>“The connection is possibly unstable.”</li>
            </ul>

            <h5 class="font-semibold mt-3">3. Introductory Phrases for Hedging Opinions</h5>
            <p>Use phrases like <em>I think, I believe, it seems, it appears, as far as I can tell, in my opinion</em> to clearly mark your statement as personal or tentative.</p>
            <ul class="list-disc pl-6">
              <li>“I think the update improves performance.”</li>
              <li>“It seems there is a bug in the code.”</li>
              <li>“In my opinion, we should revise the deadline.”</li>
            </ul>

            <h5 class="font-semibold mt-3">4. Conditional and Softening Phrases</h5>
            <p>Phrases with <em>if</em> and modal verbs or conditional forms express polite suggestions or hypothetical statements.</p>
            <ul class="list-disc pl-6">
              <li>“If possible, could you update the documentation?”</li>
              <li>“It would be helpful if you tested the new features.”</li>
            </ul>

            <h4 class="mt-4">Examples Relevant to Software Engineers</h4>
            <p><strong>Giving feedback:</strong></p>
            <ul class="list-disc pl-6">
              <li>Direct: “You made mistakes in the code.”</li>
              <li>Hedged: “I think there might be some errors in the code.”</li>
            </ul>
            <p class="mt-2"><strong>Making suggestions:</strong></p>
            <ul class="list-disc pl-6">
              <li>Direct: “Change the design.”</li>
              <li>Hedged: “Perhaps we could consider a new design.”</li>
            </ul>
            <p class="mt-2"><strong>Expressing uncertainty:</strong></p>
            <ul class="list-disc pl-6">
              <li>Direct: “The server is causing delays.”</li>
              <li>Hedged: “It seems the server could be causing delays.”</li>
            </ul>
            <p class="mt-2"><strong>Polite requests:</strong></p>
            <ul class="list-disc pl-6">
              <li>“Would you mind reviewing the documentation?”</li>
              <li>“Could you please check the test cases?”</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-hedgings-task-1', title: 'Task 1: Identify the Modal Verb or Hedging', description: 'Choose the correct modal/hedging word.', dueDate: '2025-10-16' },
            { id: 'av-hedgings-task-2', title: 'Task 2: Fill with Appropriate Hedging', description: 'Complete the sentences with correct hedging forms.', dueDate: '2025-10-17' },
            { id: 'av-hedgings-task-3', title: 'Task 3: Rewrite with Hedging', description: 'Rewrite the sentences to be more polite and less direct.', dueDate: '2025-10-18' },
            { id: 'av-hedgings-task-4', title: 'Task 4: Match – Build Polite Sentences', description: 'Match Column A with Column B to form hedged sentences.', dueDate: '2025-10-19' }
          ]
        },
        
        {
          id: 3,
          title: 'Lesson 3 - Cross-Cultural Communication Phrases',
          type: 'content',
          content: `
            <p>In international workplaces, communication styles can vary depending on culture. Using the right phrases helps to show respect, avoid misunderstandings, and build strong relationships.</p>
            <h4 class="mt-4">Common Phrases</h4>
            <ul class="list-disc pl-6 space-y-2">
              <li><strong>“Could you please clarify what you mean?”</strong> – Used when you don’t fully understand someone.</li>
              <li><strong>“Let’s make sure we’re on the same page.”</strong> – Ensures everyone has the same understanding.</li>
              <li><strong>“I understand your perspective, but in my culture we usually…”</strong> – Polite way to explain cultural differences.</li>
              <li><strong>“How is this usually handled in your team/country?”</strong> – Shows openness and curiosity.</li>
              <li><strong>“I appreciate your patience with me as I learn.”</strong> – Builds rapport when adapting to new cultural settings.</li>
              <li><strong>“Would you prefer a more direct or detailed explanation?”</strong> – Adjusts communication style based on cultural preference.</li>
              <li><strong>“Let’s find a middle ground that works for both of us.”</strong> – Encourages compromise in cross-cultural settings.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-crosscultural-task-1', title: 'Task 1: Match Phrase → Meaning', description: 'Match each cross-cultural phrase to its meaning.', dueDate: '2025-10-17' }
          ]
        },
        {
          id: 4,
          title: 'Lesson 4 - Customer Service and Client Interaction Phrases',
          type: 'content',
          content: `
            <p>Effective communication with customers and clients is crucial in technical and business environments. Using professional and polite phrases ensures issues are resolved smoothly, maintains a positive relationship, and builds trust.</p>
            <ul class="list-disc pl-6 mt-2">
              <li>Respond to inquiries or complaints</li>
              <li>Provide clear instructions or solutions</li>
              <li>Handle difficult situations diplomatically</li>
              <li>Maintain a professional tone under pressure</li>
            </ul>

            <h4 class="mt-4">Common Customer Service & Client Interaction Phrases</h4>
            <h5 class="font-semibold mt-2">1. Greeting and Initiating Interaction</h5>
            <ul class="list-disc pl-6">
              <li>“Good morning, thank you for contacting [Company Name]. How may I assist you today?”</li>
              <li>“Hello, this is [Your Name] from [Company]. How can I help you?”</li>
            </ul>
            <h5 class="font-semibold mt-3">2. Responding to Questions or Requests</h5>
            <ul class="list-disc pl-6">
              <li>“I’d be happy to help you with that.”</li>
              <li>“Let me check the details for you.”</li>
              <li>“Here’s what I can suggest…”</li>
            </ul>
            <h5 class="font-semibold mt-3">3. Handling Complaints or Issues</h5>
            <ul class="list-disc pl-6">
              <li>“I understand your concern and apologize for the inconvenience.”</li>
              <li>“Thank you for bringing this to our attention; let’s see how we can resolve it.”</li>
              <li>“I appreciate your patience while we fix this issue.”</li>
            </ul>
            <h5 class="font-semibold mt-3">4. Providing Solutions or Alternatives</h5>
            <ul class="list-disc pl-6">
              <li>“One option could be to…”</li>
              <li>“Alternatively, we can…”</li>
              <li>“To resolve this, I recommend…”</li>
            </ul>
            <h5 class="font-semibold mt-3">5. Closing the Interaction</h5>
            <ul class="list-disc pl-6">
              <li>“Thank you for your time. Please don’t hesitate to contact us if you need further assistance.”</li>
              <li>“I’m glad I could help. Have a great day!”</li>
            </ul>

            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r">
              <h5 class="font-semibold">Practical Tips</h5>
              <ul class="list-disc pl-6 mt-1">
                <li>Always maintain politeness and professionalism.</li>
                <li>Listen actively and respond appropriately.</li>
                <li>Use positive language to reassure the client.</li>
                <li>Clarify details to avoid misunderstandings.</li>
                <li>Adapt tone and language based on the client’s mood or context.</li>
              </ul>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-customer-task-1', title: 'Task 1: Role-play Recording (Video)', description: 'Record a 3–5 minute role-play using at least five phrases from the lesson. Upload your recording.', dueDate: '2025-10-18' }
          ]
        },
        {
          id: 5,
          title: 'Lesson 5 - Collaboration & Teamwork in Software Engineering',
          type: 'content',
          content: `
            <h4>Vocabulary & Concepts</h4>
            <p>Collaboration and teamwork are essential in software engineering because software projects are rarely completed by one person alone. Engineers must coordinate tasks, share knowledge, and communicate effectively. The following vocabulary terms are commonly used in software engineering teamwork contexts:</p>
            <ul class="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Collaboration</strong> – Working jointly with others to achieve a shared goal.</li>
              <li><strong>Teamwork</strong> – The combined effort of individuals to complete tasks efficiently.</li>
              <li><strong>Agile</strong> – A project management approach that emphasizes flexibility, teamwork, and quick iterations.</li>
              <li><strong>Sprint</strong> – A short, time-boxed period where a development team completes a set of tasks.</li>
              <li><strong>Scrum</strong> – A framework for managing work, based on teamwork, stand-ups, and sprints.</li>
              <li><strong>Stand-up Meeting</strong> – A short daily meeting where team members share progress and blockers.</li>
              <li><strong>Blocker</strong> – An obstacle that prevents a team member from completing their work.</li>
              <li><strong>Collaboration Tools</strong> – Digital platforms such as Jira, Trello, GitHub, or Slack that help teams coordinate tasks.</li>
              <li><strong>Knowledge Sharing</strong> – The practice of openly exchanging information and skills within a team.</li>
              <li><strong>Code Review</strong> – A collaborative process where peers review each other’s code for quality and improvement.</li>
              <li><strong>Pair Programming</strong> – Two developers working together on one workstation to solve a problem.</li>
              <li><strong>Team Synergy</strong> – The combined effect of teamwork that produces better results than individuals working alone.</li>
              <li><strong>Communication</strong> – The clear exchange of ideas and information within a team.</li>
              <li><strong>Conflict Resolution</strong> – The process of resolving disagreements in a positive way.</li>
              <li><strong>Cross-Functional Team</strong> – A group with different skills (developers, testers, designers) working together.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-collab-task-1', title: 'Task 1: Match Terms → Definitions', description: 'Match each teamwork term with its definition.', dueDate: '2025-10-19' },
            { id: 'av-collab-task-2', title: 'Task 2: Fill in the Blanks', description: 'Complete the sentences with the correct teamwork vocabulary.', dueDate: '2025-10-20' },
            { id: 'av-collab-task-3', title: 'Task 3: Teamwork – MCQ', description: 'Answer multiple-choice questions about teamwork practices.', dueDate: '2025-10-21' }
          ]
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
          title: 'Lesson 7 - Persuasion Phrases',
          type: 'content',
          content: `
            <p>Persuasion is a vital skill in technical and business environments. Professionals often need to recommend solutions, convince stakeholders, and justify timelines or priorities while keeping collaboration and respect.</p>
            <h4 class="mt-4">Common Persuasion Phrases</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 class="font-semibold">To introduce a suggestion</h5>
                <ul class="list-disc pl-6">
                  <li>“I recommend that we…”</li>
                  <li>“It would be beneficial if we…”</li>
                  <li>“One possible solution is to…”</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold">To justify with evidence</h5>
                <ul class="list-disc pl-6">
                  <li>“The data shows that…”</li>
                  <li>“Research indicates…”</li>
                  <li>“Based on our results, it seems reasonable to…”</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold">To emphasize importance</h5>
                <ul class="list-disc pl-6">
                  <li>“This approach is crucial because…”</li>
                  <li>“It’s worth noting that…”</li>
                  <li>“What makes this significant is…”</li>
                </ul>
              </div>
              <div>
                <h5 class="font-semibold">To invite agreement or feedback</h5>
                <ul class="list-disc pl-6">
                  <li>“Would you agree that…?”</li>
                  <li>“Does this align with your perspective?”</li>
                  <li>“How do you see this fitting into our plan?”</li>
                </ul>
              </div>
            </div>

            <h5 class="font-semibold mt-4">To offer alternatives politely</h5>
            <ul class="list-disc pl-6">
              <li>“An alternative could be…”</li>
              <li>“If this doesn’t seem feasible, we might consider…”</li>
              <li>“Another option worth exploring is…”</li>
            </ul>

            <div class="bg-green-50 border-l-4 border-green-400 p-4 my-4 rounded-r">
              <h5 class="font-semibold">Key Takeaways</h5>
              <ul class="list-disc pl-6 mt-1">
                <li>Use persuasion phrases to propose solutions and justify ideas.</li>
                <li>Support arguments with data and clear reasoning.</li>
                <li>Combine assertiveness with politeness to maintain professionalism and collaboration.</li>
              </ul>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'av-persuasion-task-1', title: 'Task 1: Persuasion – MCQ + Fill', description: 'Answer MCQs and complete sentences using persuasion phrases.', dueDate: '2025-10-25' }
          ]
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
          title: 'Lesson 1 - Writing clear and concise emails',
          type: 'content',
          content: `
            <h3>Writing Clear and Concise Emails</h3>
            <p>Professional emails should be easy to read and understand. Keep subject lines specific, use short sentences, and format your content with bullet points when listing information.</p>
            <ul class="list-disc pl-6 mt-3">
              <li><strong>Subject:</strong> Summarize the purpose (e.g., “Budget Meeting – Friday, 2 PM”).</li>
              <li><strong>Opening:</strong> Be polite and professional (e.g., “Good morning, I hope this message finds you well.”).</li>
              <li><strong>Body:</strong> Keep it brief; use bullet points for clarity.</li>
              <li><strong>Tone:</strong> Avoid slang and informal abbreviations like “u” or “btw”.</li>
              <li><strong>Closing:</strong> Use professional sign-offs (e.g., “Best regards,”).</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-email-task-1', title: 'Task 1: Email Clarity – True/False', description: 'Decide if each statement is True or False.', dueDate: '2025-11-12' },
            { id: 'be-email-task-2', title: 'Task 2: Email Essentials – MCQ', description: 'Choose the best option for clarity and professionalism.', dueDate: '2025-11-13' }
          ]
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
          id: 5,
          title: 'Lesson 5 - Teamwork and leadership communication',
          type: 'content',
          content: `
            <div class="bg-gray-50 border rounded p-4">
              <p>Good teamwork and leadership depend on <strong>clear, respectful, and motivating communication</strong>.</p>
              <ul class="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Encourage collaboration</strong> → Use inclusive language like “Let’s work on this together.”</li>
                <li><strong>Delegate tasks clearly</strong> → Assign roles and responsibilities without confusion.</li>
                <li><strong>Motivate your team</strong> → Recognize effort and achievements to build confidence.</li>
                <li><strong>Invite input and feedback</strong> → Value everyone’s ideas and promote open discussion.</li>
                <li><strong>Keep the team positive and focused</strong> → Guide conversations toward solutions instead of problems.</li>
              </ul>
              <p class="mt-3">Strong communication builds trust, improves efficiency, and helps a team achieve common goals.</p>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-teamwork-task-1', title: 'Task 1: Leadership Communication – Complete the Sentences', description: 'Choose the correct letter (A–E) to complete each sentence.', dueDate: '2025-11-16' },
            { id: 'be-teamwork-task-2', title: 'Task 2: Phrase → Purpose (Leadership)', description: 'Match the leadership communication phrase to the correct purpose.', dueDate: '2025-11-17' }
          ]
        },
        {
          id: 6,
          title: 'Lesson 6 - Report Writing',
          type: 'content',
          content: `
            <p>In the software industry, report writing is an essential business communication skill. Reports document work clearly and professionally for managers, clients, and stakeholders, supporting decision‑making, planning, and accountability.</p>
            <h4 class="mt-4">Purpose of Report Writing</h4>
            <ul class="list-disc pl-6">
              <li>Present project progress and performance updates.</li>
              <li>Document testing results or bug‑tracking logs.</li>
              <li>Recommend solutions for technical or organisational issues.</li>
              <li>Record research, feasibility studies, or case analyses.</li>
            </ul>
            <p class="mt-2">Unlike informal communication, reports follow a structured format that makes information easy to follow.</p>
            <h4 class="mt-4">Structure of a Business/Technical Report</h4>
            <ul class="list-disc pl-6">
              <li><strong>Title Page/Heading</strong> – Identifies the report.</li>
              <li><strong>Introduction</strong> – Purpose, scope, and objectives.</li>
              <li><strong>Background/Problem Statement</strong> – Necessary context.</li>
              <li><strong>Findings/Analysis</strong> – Facts, data, test results, observations.</li>
              <li><strong>Discussion</strong> – Interpret results and implications.</li>
              <li><strong>Recommendations/Conclusion</strong> – Solutions or next steps.</li>
            </ul>
            <h4 class="mt-4">Qualities of an Effective Report</h4>
            <ul class="list-disc pl-6">
              <li><strong>Clarity</strong> – Simple, direct language.</li>
              <li><strong>Concise</strong> – Short, relevant sentences.</li>
              <li><strong>Objectivity</strong> – Evidence‑based conclusions.</li>
              <li><strong>Organisation</strong> – Logical sequence with headings.</li>
              <li><strong>Professional Tone</strong> – Formal and polite style.</li>
            </ul>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r">
              <h5 class="font-semibold">Importance for Software Engineers</h5>
              <ul class="list-disc pl-6 mt-1">
                <li>Clear updates across technical and non‑technical teams.</li>
                <li>Testing/debugging processes documented for future reference.</li>
                <li>Managers and clients can trust and act on the information.</li>
                <li>Professional credibility through well‑structured documentation.</li>
              </ul>
              <p class="mt-2">Good report writing is as critical as good coding—both contribute to project success.</p>
            </div>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-reportwriting-task-1', title: 'Task 1: Report Writing – MCQ', description: 'Select the correct answers about report writing.', dueDate: '2025-11-22' },
            { id: 'be-reportwriting-task-2', title: 'Task 2: Report Writing – Fill in the Blanks', description: 'Complete the sentences with the correct terms.', dueDate: '2025-11-23' },
            { id: 'be-reportwriting-task-3', title: 'Task 3: Report Writing – True/False', description: 'Decide if each statement is true or false.', dueDate: '2025-11-24' }
          ]
        },
        {
          id: 7,
          title: 'Lesson 7 - Negotiation',
          type: 'content',
          content: `
            <h3>Common Negotiation Phrases</h3>
            <p>Negotiation is a key skill in the workplace, especially for software engineers working with clients, vendors, or cross-functional teams. Using the right phrases helps you express ideas clearly, propose solutions, and reach agreements professionally.</p>

            <h4 class="mt-4">1. Opening the Negotiation</h4>
            <ul class="list-disc pl-6">
              <li><strong>"Let's discuss how we can work this out."</strong> – polite way to start a negotiation.</li>
              <li><strong>"I'd like to explore possible solutions."</strong> – shows willingness to collaborate.</li>
              <li><strong>"Can we review the requirements together?"</strong> – focuses on facts and shared understanding.</li>
            </ul>

            <h4 class="mt-4">2. Making Proposals</h4>
            <ul class="list-disc pl-6">
              <li><strong>"What if we tried this approach instead?"</strong> – suggests an alternative.</li>
              <li><strong>"We could consider adjusting the timeline to…"</strong> – proposes a compromise.</li>
              <li><strong>"One option might be to…"</strong> – introduces possible solutions without sounding forceful.</li>
            </ul>

            <h4 class="mt-4">3. Expressing Agreement or Partial Agreement</h4>
            <ul class="list-disc pl-6">
              <li><strong>"That sounds reasonable, but…"</strong> – agrees in principle while adding conditions.</li>
              <li><strong>"I can work with that if we…"</strong> – shows willingness to accept with modifications.</li>
              <li><strong>"We're aligned on X, now let's look at Y."</strong> – confirms agreement on some points while continuing the discussion.</li>
            </ul>

            <h4 class="mt-4">4. Expressing Disagreement Politely</h4>
            <ul class="list-disc pl-6">
              <li><strong>"I'm not sure that will work because…"</strong> – provides reasoning without confrontation.</li>
              <li><strong>"I understand your point, but we might face challenges with…"</strong> – acknowledges the other party's view while explaining your concerns.</li>
              <li><strong>"That could be difficult to implement due to…"</strong> – focuses on objective limitations.</li>
            </ul>

            <h4 class="mt-4">5. Clarifying and Summarizing</h4>
            <ul class="list-disc pl-6">
              <li><strong>"Just to clarify, you're suggesting…?"</strong> – confirms understanding.</li>
              <li><strong>"So, if I understand correctly, we agree on…"</strong> – summarizes agreement points.</li>
              <li><strong>"Let's make sure we're on the same page regarding…"</strong> – ensures alignment.</li>
            </ul>

            <h4 class="mt-4">6. Closing the Negotiation</h4>
            <ul class="list-disc pl-6">
              <li><strong>"Can we agree to move forward with this plan?"</strong> – formal closing question.</li>
              <li><strong>"Let's document the agreed points and proceed."</strong> – ensures clarity and follow-up.</li>
              <li><strong>"I think we have a workable solution."</strong> – signals resolution and consensus.</li>
            </ul>

            <h4 class="mt-4">Tips for Software Engineers:</h4>
            <ul class="list-disc pl-6">
              <li>Use neutral, professional language; avoid emotional or confrontational words.</li>
              <li>Focus on solutions and facts, not personalities.</li>
              <li>Combine negotiation phrases with technical explanations when discussing project timelines, features, or resources.</li>
            </ul>
          `,
          duration: '1 day',
          completed: false,
          tasks: [
            { id: 'be-negotiation-task-1', title: 'Task 1: Match Negotiation Phrases', description: 'Match the negotiation phrase with its function.', dueDate: '2025-11-18' },
            { id: 'be-negotiation-task-2', title: 'Task 2: Complete the Dialogue', description: 'Complete the dialogue using the negotiation phrases from the box.', dueDate: '2025-11-19' }
          ]
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
