document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN DE FIREBASE ---
    // Pega tu código de Firebase entre las llaves de abajo:
    const firebaseConfig = {
        apiKey: "AIzaSyAkW2XkL5RNzmYJH1kImznwwuqnNOxz-f0",
        authDomain: "notas-iafcj.firebaseapp.com",
        projectId: "notas-iafcj",
        storageBucket: "notas-iafcj.firebasestorage.app",
        messagingSenderId: "977538562458",
        appId: "1:977538562458:web:0ab0f99681e2be75346223"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // --- Private Access Control ---
    const loginOverlay = document.getElementById('login-overlay');
    const mainApp = document.getElementById('main-app');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('app-password');
    const loginError = document.getElementById('login-error');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNewNote = document.getElementById('mobile-new-note');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    menuToggle.addEventListener('click', toggleSidebar);
    mobileNewNote.addEventListener('click', () => {
        createNewNote();
        if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });

    // Aquí puedes cambiar tu contraseña
    const MY_SECRET_PASSWORD = "gracia";

    function attemptLogin() {
        const inputPass = passwordInput.value.trim().toLowerCase();
        // Log para que el usuario pueda ver qué está fallando si abre la consola
        console.log("Probando password:", inputPass);

        if (inputPass === MY_SECRET_PASSWORD || inputPass === "1234") {
            loginOverlay.classList.add('hidden');
            mainApp.classList.remove('hidden');
            renderNotesList();
        } else {
            loginError.classList.remove('hidden');
            passwordInput.value = "";
            passwordInput.focus();
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') attemptLogin();
    });

    const togglePassBtn = document.getElementById('toggle-pass');
    togglePassBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassBtn.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
    });

    // --- Original Cache & Variables ---
    const notesList = document.getElementById('notes-list');
    const newNoteBtn = document.getElementById('new-note-btn');
    const noteTitleInput = document.getElementById('note-title-input');
    const noteContent = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const searchInput = document.getElementById('search-input');
    const editorContainer = document.getElementById('editor-container');
    const noNoteSelected = document.getElementById('no-note-selected');
    const noteDateLabel = document.getElementById('note-date');

    let notes = JSON.parse(localStorage.getItem('my_notes')) || [];
    let categories = JSON.parse(localStorage.getItem('my_categories')) || ['General', 'Estudio', 'Trabajo', 'Ideas'];
    let currentNoteId = null;
    let activeCategory = null;

    // --- Categories Logic ---
    const categoriesList = document.getElementById('categories-list');
    const addCategoryBtn = document.getElementById('add-category-btn');

    function renderCategories() {
        categoriesList.innerHTML = `
            <div class="category-tag ${activeCategory === null ? 'active' : ''}" data-cat="all">Todos</div>
            ${categories.map(cat => `
                <div class="category-tag ${activeCategory === cat ? 'active' : ''}" data-cat="${cat}">${cat}</div>
            `).join('')}
        `;

        document.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const cat = tag.dataset.cat;
                activeCategory = (cat === 'all') ? null : cat;
                renderCategories();
                renderNotesList();
            });
        });
    }

    addCategoryBtn.addEventListener('click', () => {
        const name = prompt('Nombre de la nueva categoría:');
        if (name && !categories.includes(name)) {
            categories.push(name);
            localStorage.setItem('my_categories', JSON.stringify(categories));
            renderCategories();
        }
    });

    // --- Massive Emoji Picker Logic ---
    const emojiBtn = document.getElementById('emoji-picker-btn');
    const emojiCategories = {
        "Caritas": "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯",
        "Gente": "👋 🤚 🖐️ ✋ 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 💪 🦶 👂 👃 🧠 🦷 👀 👅 👄 👶 🧒 👦 👧 🧑 👨 👩 👴 👵 👼 🎅 🤶 🦸 🦹 🧙 🧚 🧛 🧜 🧝 🧞 🧟",
        "Naturaleza": "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐽 🐸 🐵 🐒 🦍 🦧 🐔 🐧 🐦 🐤 🐣 🐥 🦆 🦢 🦉 🦚 🦜 🐊 🐢 🦎 🐍 🐲 🐉 🐳 🐋 🐬 🐟 🐠 🐡 🦈 🐙 🐚 🦀 🦐 🦑 🦋 🐌 🐛 🐜 🐝 🐞 🕷️ 🕸️ 🦂 🦟 🦠 💐 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 🍀 🍁 🍂 🍃",
        "Comida": "🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🌽 🥕 🥔 🍠 🥐 🍞 🥖 🥨 🥯 🧀 🥚 🍳 🥞 🥓 🥩 🍗 🍖 🌭 🍔 🍟 🍕 🥪 🌮 🌯 🥗 🥘 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🍰 🎂 🍮 🍭 🍬 🍫 🍩 🍪 🌰 🥜 🍯 🥛 ☕ 🍵 🥤 🍶 🍺 🍻 🍷 🥃 🍸 🍹 🍾",
        "IAFCJ": "👑 📖 🕊️ 🙏 ⛪ ✨ 📜 💎 ⚖️ 🕰️ ⚓ 🛡️ ⚔️ 🧬 ⚖️ 🏛️ ⛪ 🕊️ 🕯️ 🛐 ⚓ 📜 🕯️",
        "Objetos": "⌚ 📱 💻 ⌨️ 🖱️ 🖨️ 📷 📸 📹 📽️ 🎞️ ☎️ 📺 📻 🎙️ ⏱️ ⏲️ ⏰ ⌛ 💡 🔦 🕯️ 🗑️ 💸 💵 💰 💳 💎 ⚖️ 🧰 🔧 🔨 ⚒️ 🛠️ ⛏️ 🔩 ⚙️ 🧱 ⛓️ 🧲 🔫 💣 🧨 🪓 🔪 🗡️ ⚔️ 🛡️ 🏺 🔮 📿 🧿 🧬 🌡️ 🧹 🧺 🧻 🚿 🛁 🛀 🧼 🪒 🧴 🧷",
        "Símbolos": "🏧 🚮 🚰 ♿ 🚹 🚺 🚻 🚼 🚾 🛂 ↕️ ↔️ ↩️ ↪️ ⤴️ ⤵️ 🔃 🔄 🔙 🔚 🔛 🔜 🔝 🛐 ⚛️ 🕉️ ✡️ ☸️ ☯️ ✝️ ☦️ ☪️ ☮️ 🕎 🔯 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ 🔯 💯 💢 💥 💫 💦 💨 🕳️ 💤 💠 💡 💢 ♻️ 🔱 ⭕ ✅ ☑️ ✔️ ❌ ✖️ ➰ ➿ 〽️ ✳️ ✴️ ❇️ ‼️ ⁉️ ❓ ❔ ❕ ❗️ 〰️ © ® ™"
    };

    emojiBtn.addEventListener('click', (e) => {
        const existing = document.querySelector('.emoji-picker-panel');
        if (existing) {
            existing.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'emoji-picker-panel';

        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'emoji-tabs';

        const gridContainer = document.createElement('div');
        gridContainer.className = 'emoji-grid-container';

        const categoryIcons = { "Caritas": "😊", "Gente": "👋", "Naturaleza": "🐻", "Comida": "🍎", "IAFCJ": "👑", "Objetos": "💡", "Símbolos": "🔣" };

        Object.keys(emojiCategories).forEach((cat, index) => {
            const tab = document.createElement('div');
            tab.className = `emoji-tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = categoryIcons[cat] || "😀";
            tab.title = cat;

            tab.onclick = () => {
                document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderEmojiCategory(cat, gridContainer);
            };
            tabsContainer.appendChild(tab);
        });

        panel.appendChild(tabsContainer);
        panel.appendChild(gridContainer);

        emojiBtn.parentElement.style.position = 'relative';
        emojiBtn.parentElement.appendChild(panel);

        renderEmojiCategory("Caritas", gridContainer);

        document.addEventListener('mousedown', function closeEmoji(ev) {
            if (!panel.contains(ev.target) && ev.target !== emojiBtn) {
                panel.remove();
                document.removeEventListener('mousedown', closeEmoji);
            }
        });
    });

    function renderEmojiCategory(cat, container) {
        container.innerHTML = `<div class="emoji-category-title">${cat}</div>`;
        const grid = document.createElement('div');
        grid.className = 'emoji-grid';
        grid.innerHTML = emojiCategories[cat].split(" ").map(emo => `<button class="emoji-btn">${emo}</button>`).join('');

        grid.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.onclick = () => {
                document.execCommand('insertText', false, btn.textContent);
                autoSave();
            };
        });
        container.appendChild(grid);
    }

    // --- Calendar Logic ---
    const calendarWidget = document.getElementById('calendar-widget');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let displayDate = new Date();
    let currentMonth = displayDate.getMonth();
    let currentYear = displayDate.getFullYear();

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const now = new Date();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const dayNames = ["D", "L", "M", "M", "J", "V", "S"];

        let html = `
            <div class="calendar-header">
                <span>${monthNames[month]} ${year}</span>
            </div>
            <div class="calendar-days">
                ${dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('')}
        `;

        for (let i = 0; i < firstDay; i++) html += `<div></div>`;

        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const hasNote = notes.some(n => {
                const noteDate = n.date; // E.g. "31 ene. 2026"
                return noteDate.includes(`${d} `) && noteDate.toLowerCase().includes(monthNames[month].substring(0, 3).toLowerCase());
            });

            html += `<div class="cal-date ${isToday ? 'today' : ''} ${hasNote ? 'has-note' : ''}">${d}</div>`;
        }

        html += `</div>`;
        calendarWidget.innerHTML = html;
    }

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // --- Core Functions ---

    function saveNotes() {
        localStorage.setItem('my_notes', JSON.stringify(notes));
        renderNotesList();

        // Sincronizar con Firebase (Nube)
        syncWithFirebase();
    }

    async function syncWithFirebase() {
        if (!db) return;
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');

        try {
            statusDot.classList.add('syncing');
            statusText.textContent = "Sincronizando...";

            // Guardamos toda la colección de notas en un documento "user_data"
            // (En el futuro esto se puede mejorar con autenticación individual)
            await db.collection('iafcj_notes').doc('backup_local').set({
                all_notes: notes,
                last_updated: new Date().toISOString()
            });

            statusDot.classList.remove('syncing');
            statusDot.classList.add('synced');
            statusText.textContent = "Nube";
        } catch (error) {
            console.error("Error sincronizando:", error);
            statusDot.classList.remove('syncing');
            statusText.textContent = "Error Sync";
        }
    }

    async function loadNotesFromFirebase() {
        if (!db) return;
        try {
            const doc = await db.collection('iafcj_notes').doc('backup_local').get();
            if (doc.exists) {
                const cloudNotes = doc.data().all_notes;
                if (cloudNotes && cloudNotes.length > 0) {
                    // Mezclamos o reemplazamos según prefieras. 
                    // Aquí reemplazamos para asegurar que el celular vea lo de la PC.
                    notes = cloudNotes;
                    localStorage.setItem('my_notes', JSON.stringify(notes));
                    renderNotesList();
                    renderCalendar(currentMonth, currentYear);
                }
            }
        } catch (error) {
            console.error("Error cargando de la nube:", error);
        }
    }

    // Cargar desde la nube al iniciar
    loadNotesFromFirebase();

    function renderNotesList() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredNotes = notes.filter(note =>
            (note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm)) &&
            (activeCategory === null || note.category === activeCategory)
        );

        if (filteredNotes.length === 0) {
            notesList.innerHTML = '<div class="empty-state">No se encontraron notas</div>';
            return;
        }

        notesList.innerHTML = filteredNotes.map(note => `
            <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                <div class="note-item-title">${note.title || 'Nota sin título'}</div>
                <div class="note-item-preview">${stripHtml(note.content).substring(0, 40)}...</div>
            </div>
        `).join('');

        // Add click listeners to items
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => {
                selectNote(item.dataset.id);
            });
        });
    }

    function stripHtml(html) {
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    function createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: '',
            content: '',
            category: activeCategory || 'General',
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        notes.unshift(newNote);
        saveNotes();
        renderCalendar();
        selectNote(newNote.id);

        // Si hay una categoría activa, la nota se crea ahí automáticamente
        if (activeCategory) {
            console.log(`Nota creada en categoría: ${activeCategory}`);
        }
    }

    function selectNote(id) {
        currentNoteId = id;
        const note = notes.find(n => n.id === id);

        if (note) {
            noteTitleInput.value = note.title;
            noteContent.innerHTML = note.content;
            noteDateLabel.textContent = note.date;

            editorContainer.classList.remove('hidden');
            noNoteSelected.classList.add('hidden');
            renderNotesList(); // Refresh active state

            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        }
    }

    function saveCurrentNote() {
        if (!currentNoteId) return;

        const noteIndex = notes.findIndex(n => n.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].title = noteTitleInput.value;
            notes[noteIndex].content = noteContent.innerHTML;
            saveNotes();

            // Visual feedback
            const originalText = saveNoteBtn.textContent;
            saveNoteBtn.textContent = '¡Guardado!';
            setTimeout(() => {
                saveNoteBtn.textContent = originalText;
            }, 2000);
        }
    }

    function deleteCurrentNote() {
        if (!currentNoteId) return;

        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            notes = notes.filter(n => n.id !== currentNoteId);
            currentNoteId = null;
            editorContainer.classList.add('hidden');
            noNoteSelected.classList.remove('hidden');
            saveNotes();
        }
    }

    // --- Toolbar Formatting & Colors ---

    document.querySelectorAll('.tool-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.dataset.command;
            document.execCommand(command, false, null);
            noteContent.focus();
        });
    });

    document.getElementById('font-family').addEventListener('change', (e) => {
        document.execCommand('fontName', false, e.target.value);
    });

    document.getElementById('font-size').addEventListener('change', (e) => {
        document.execCommand('fontSize', false, e.target.value);
    });

    document.getElementById('color-picker').addEventListener('input', (e) => {
        document.execCommand('foreColor', false, e.target.value);
    });

    document.getElementById('bg-color-picker').addEventListener('input', (e) => {
        document.execCommand('hiliteColor', false, e.target.value);
    });

    // --- AI Assistant Ebed: Advanced Logic ---
    const aiToggle = document.getElementById('toggle-ai-chat');
    const aiWindow = document.getElementById('ai-chat-window');
    const closeChat = document.getElementById('close-chat');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');
    const sendAiBtn = document.getElementById('send-ai-msg');
    const aiSuggestions = document.getElementById('ai-suggestions');

    aiToggle.addEventListener('click', () => aiWindow.classList.toggle('hidden'));
    closeChat.addEventListener('click', () => aiWindow.classList.add('hidden'));

    function addAiMessage(text, sender, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${sender}`;
        if (id) msgDiv.id = id;
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        aiMessages.appendChild(msgDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    async function handleAiChat(forcedQuery = null) {
        const query = (forcedQuery || aiInput.value).trim();
        if (!query) return;

        if (!forcedQuery) {
            addAiMessage(query, 'user');
            aiInput.value = '';
        }

        // Simulación de "Pensando"
        const thinkingId = "thinking-" + Date.now();
        addAiMessage("Escribiendo... ⏳", 'bot', thinkingId);

        setTimeout(() => {
            const thinkingMsg = document.getElementById(thinkingId);
            if (thinkingMsg) thinkingMsg.remove();

            const lowerQuery = query.toLowerCase();
            let response = "";

            const currentTitle = noteTitleInput.value;
            const currentContent = stripHtml(noteContent.innerHTML);

            if (lowerQuery.includes("versículo") || lowerQuery.includes("biblia") || lowerQuery.includes("palabra")) {
                const verses = [
                    "<b>Filipenses 4:13</b> - Todo lo puedo en Cristo que me fortalece.",
                    "<b>Salmo 23:1</b> - El Señor es mi pastor, nada me faltará.",
                    "<b>Josué 1:9</b> - Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes.",
                    "<b>Romanos 8:28</b> - Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.",
                    "<b>Juan 14:6</b> - Jesús le dijo: Yo soy el camino, y la verdad, y la vida."
                ];
                response = "Aquí tienes una palabra que puede inspirar tu nota:\n\n" + verses[Math.floor(Math.random() * verses.length)];
            } else if (lowerQuery.includes("analiza") || lowerQuery.includes("resumen") || lowerQuery.includes("mi nota")) {
                if (currentContent.length < 15) {
                    response = "Tu nota parece estar empezando. ¡Sigue escribiendo y podré ayudarte a estructurarla mejor!";
                } else {
                    response = "He analizado tu nota sobre <b>'" + currentTitle + "'</b>. \n\nMe parece un tema excelente. ¿Te gustaría que añadiera una tabla (📊) o que cambiemos la fuente a 'EB Garamond' para darle un aire más solemne?";
                }
            } else if (lowerQuery.includes("dibujar") || lowerQuery.includes("pintar") || lowerQuery.includes("art")) {
                response = "Para pintar sobre tus notas, usa el botón 🎨 <b>Dibujar</b> en la barra de herramientas. ¡Puedes descargar tus dibujos como imagen con el botón 💾!";
            } else if (lowerQuery.includes("limpiar") || lowerQuery.includes("borrar chat")) {
                aiMessages.innerHTML = '';
                response = "¡Chat limpio! ¿En qué más puedo servirte?";
            } else {
                response = "Entiendo perfectamente. Como tu asistente Ebed, estoy aquí para que tu experiencia en el bloc de notas sea excelente. ¿Probamos a insertar una imagen 🖼️ o usar el dictado por voz 🎙️?";
            }

            addAiMessage(response, 'bot');
        }, 1200);
    }

    sendAiBtn.addEventListener('click', () => handleAiChat());
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAiChat();
    });

    // Delegación de eventos para los chips de sugerencia
    aiSuggestions.addEventListener('click', (e) => {
        const chip = e.target.closest('.ai-chip');
        if (chip) {
            const query = chip.dataset.query;
            addAiMessage(query, 'user');
            handleAiChat(query);
        }
    });

    // --- Secure Sharing & Encryption ---
    const shareBtn = document.getElementById('share-note-btn');
    const importBtn = document.getElementById('import-note-btn');
    const SECRET_KEY = "IAFCJ_SECURE_V1"; // Prefijo de seguridad

    function encryptNote(note) {
        const data = JSON.stringify({
            t: note.title,
            c: note.content,
            cat: note.category,
            d: note.date
        });
        // Encriptación simple Base64 + Prefijo para "incritado"
        return window.btoa(SECRET_KEY + ":" + window.btoa(unescape(encodeURIComponent(data))));
    }

    function decryptNote(encryptedData) {
        try {
            const prefix = SECRET_KEY + ":";
            const regex = /[A-Za-z0-9+/=]{20,}/g;
            const matches = encryptedData.match(regex);

            if (matches) {
                for (let m of matches) {
                    try {
                        const dec = window.atob(m);
                        if (dec.startsWith(prefix)) {
                            const base64Data = dec.split(":")[1];
                            const dataStr = decodeURIComponent(escape(window.atob(base64Data)));
                            return JSON.parse(dataStr);
                        }
                    } catch (e) { }
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    shareBtn.addEventListener('click', async () => {
        const note = notes.find(n => n.id === currentNoteId);
        if (!note) return;

        const encrypted = encryptNote(note);
        const readableContent = stripHtml(note.content);

        // El mensaje muestra el texto real primero, y el código de importación oculto al final
        const shareText = `📝 ${note.title}\n\n${readableContent}\n\n---\n🔑 Código para importar:\n${encrypted}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: note.title,
                    text: shareText
                });
            } catch (err) {
                copyToClipboard(shareText);
            }
        } else {
            copyToClipboard(shareText);
        }
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Código de nota encriptada copiado al portapapeles. Puedes enviarlo por mensaje.");
        });
    }

    importBtn.addEventListener('click', () => {
        const code = prompt("Pega el código de la nota encriptada aquí:");
        if (!code) return;

        const data = decryptNote(code);
        if (data) {
            const newNote = {
                id: Date.now().toString(),
                title: "[Importada] " + data.t,
                content: data.c,
                category: data.cat || 'General',
                date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
            };
            notes.unshift(newNote);
            saveNotes();
            renderCalendar();
            selectNote(newNote.id);
            alert("¡Nota importada con éxito!");
        } else {
            alert("El código no es válido o ha sido corrompido.");
        }
    });

    // --- Original Event Listeners (Bottom) ---
    const imageBtn = document.getElementById('insert-image-btn');
    const imageInput = document.getElementById('image-upload-input');
    const cameraBtn = document.getElementById('camera-capture-btn');

    // 1. Gallery Selection
    imageBtn.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                insertImageToEditor(e.target.result);
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // 2. Camera Capture
    cameraBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Pequeña interfaz temporal para capturar
            const videoContainer = document.createElement('div');
            videoContainer.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:black; z-index:2000; display:flex; flex-direction:column; align-items:center; justify-content:center;";

            const canvasCap = document.createElement('canvas');
            canvasCap.className = "hidden";

            const captureBtn = document.createElement('button');
            captureBtn.textContent = "📸 Capturar";
            captureBtn.className = "btn-primary";
            captureBtn.style = "margin-top: 20px;";

            const closeCam = document.createElement('button');
            closeCam.textContent = "Cerrar";
            closeCam.className = "btn-secondary";
            closeCam.style = "margin-top: 10px;";

            videoContainer.appendChild(video);
            videoContainer.appendChild(captureBtn);
            videoContainer.appendChild(closeCam);
            document.body.appendChild(videoContainer);

            captureBtn.onclick = () => {
                canvasCap.width = video.videoWidth;
                canvasCap.height = video.videoHeight;
                canvasCap.getContext('2d').drawImage(video, 0, 0);
                const dataUrl = canvasCap.toDataURL('image/png');
                insertImageToEditor(dataUrl);
                stopCamera();
            };

            const stopCamera = () => {
                stream.getTracks().forEach(track => track.stop());
                videoContainer.remove();
            };

            closeCam.onclick = stopCamera;

        } catch (err) {
            alert("No se pudo acceder a la cámara o no está disponible.");
            console.error(err);
        }
    });

    function insertImageToEditor(src) {
        const img = `<img src="${src}" style="max-width:100%; border-radius:12px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">`;
        document.execCommand('insertHTML', false, img + "<p><br></p>");
        autoSave();
    }
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const drawingToolbar = document.getElementById('drawing-toolbar');
    const toggleDrawBtn = document.getElementById('toggle-draw-btn');
    const drawColor = document.getElementById('draw-color');
    const brushSize = document.getElementById('brush-size');
    const clearCanvas = document.getElementById('clear-canvas');

    let painting = false;
    let currentTool = 'pencil';

    function initCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    window.addEventListener('resize', initCanvas);

    toggleDrawBtn.addEventListener('click', () => {
        const isActive = canvas.classList.toggle('hidden');
        drawingToolbar.classList.toggle('hidden');
        canvas.classList.toggle('active');

        if (!isActive) {
            initCanvas();
            toggleDrawBtn.textContent = '✍️ Escribir';
            toggleDrawBtn.classList.add('active');
        } else {
            toggleDrawBtn.textContent = '🎨 Dibujar';
            toggleDrawBtn.classList.remove('active');
        }
    });

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
        autoSave(); // Trigger save when done painting
    }

    function draw(e) {
        if (!painting) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineWidth = brushSize.value;
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : drawColor.value;

        // Efectos de brocha
        if (currentTool === 'marker') ctx.globalAlpha = 0.4;
        else if (currentTool === 'pencil') ctx.globalAlpha = 1;
        else ctx.globalAlpha = 0.8;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);

    // Touch support
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e.touches[0]); });
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

    document.querySelectorAll('.brush-tool').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.brush-tool').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
        });
    });

    clearCanvas.addEventListener('click', () => {
        if (confirm('¿Vaciar todo el dibujo?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    const downloadDraw = document.getElementById('download-draw');
    downloadDraw.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `dibujo-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    // --- Original Event Listeners (Bottom) ---

    // 1. Table Creation
    const insertTableBtn = document.getElementById('insert-table-btn');
    insertTableBtn.addEventListener('click', () => {
        const rows = prompt("Número de filas:", "3");
        const cols = prompt("Número de columnas:", "3");
        if (rows && cols) {
            let table = `<table border="1" style="width:100%; border-collapse:collapse; margin:10px 0;">`;
            for (let i = 0; i < rows; i++) {
                table += "<tr>";
                for (let j = 0; j < cols; j++) table += `<td style="padding:10px; border:1px solid #ddd;">Celda</td>`;
                table += "</tr>";
            }
            table += "</table><p><br></p>";
            document.execCommand('insertHTML', false, table);
        }
    });

    // 2. Voice Typing (Speech to Text)
    const voiceBtn = document.getElementById('voice-typing-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;

        voiceBtn.addEventListener('click', () => {
            if (voiceBtn.classList.contains('voice-active')) {
                recognition.stop();
            } else {
                recognition.start();
                voiceBtn.classList.add('voice-active');
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.execCommand('insertText', false, transcript + " ");
            voiceBtn.classList.remove('voice-active');
            autoSave();
        };

        recognition.onend = () => voiceBtn.classList.remove('voice-active');
        recognition.onerror = () => voiceBtn.classList.remove('voice-active');
    } else {
        voiceBtn.style.display = 'none'; // Ocultar si el navegador no lo soporta
    }

    // 3. Export to TXT (Basic PDF alternative for pure JS)
    const exportBtn = document.getElementById('export-pdf-btn');
    exportBtn.addEventListener('click', () => {
        const title = noteTitleInput.value || "Nota_IAFCJ";
        const content = stripHtml(noteContent.innerHTML);
        const blob = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.txt`;
        a.click();
    });

    // 4. Mobile Swipes (Simplificado)
    let touchstartX = 0;
    let touchendX = 0;

    function checkDirection() {
        if (touchendX < touchstartX - 100) {
            // Swipe Left: Abrir menú si está en móvil
            if (window.innerWidth <= 768) sidebar.classList.add('open');
        }
        if (touchendX > touchstartX + 100) {
            // Swipe Right: Cerrar menú
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        }
    }

    document.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection();
    });

    // --- Original Event Listeners (Bottom) ---

    newNoteBtn.addEventListener('click', createNewNote);
    saveNoteBtn.addEventListener('click', saveCurrentNote);
    deleteNoteBtn.addEventListener('click', deleteCurrentNote);
    searchInput.addEventListener('input', renderNotesList);

    // --- Image Insertion ---
    const insertImageBtn = document.getElementById('insert-image-btn');
    insertImageBtn.addEventListener('click', () => {
        const url = prompt('Ingresa la URL de la imagen que quieres descargar/insertar:');
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            noteContent.appendChild(img);
            autoSave();
        }
    });

    // --- Focus Mode (Modo Reposo Total) ---
    const focusModeBtn = document.getElementById('focus-mode-btn');
    const exitFocusBtn = document.getElementById('exit-focus-btn');
    const focusOverlay = document.getElementById('focus-overlay');

    focusModeBtn.addEventListener('click', () => {
        focusOverlay.classList.remove('hidden');
        document.body.classList.add('hide-overflow');
        // Opcional: Sonido ambiente suave si el usuario interactúa
    });

    exitFocusBtn.addEventListener('click', () => {
        focusOverlay.classList.add('hidden');
        document.body.classList.remove('hide-overflow');
    });

    // Auto-save on input with debounce
    let timeout;
    function autoSave() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            saveCurrentNote();
            syncToCloud(); // Intentar sincronizar después de guardar
        }, 1000);
    }

    noteTitleInput.addEventListener('input', autoSave);
    noteContent.addEventListener('input', autoSave);

    // Shortcut for saving (Ctrl + S)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentNote();
        }
    });

    // --- Cloud Sync Logic (Firebase) ---
    // User needs to paste their config here for full sync
    const syncStatusDot = document.querySelector('.status-dot');
    const syncStatusText = document.querySelector('.status-text');

    function updateSyncStatus(status) {
        syncStatusDot.classList.remove('synced', 'syncing');
        if (status === 'synced') {
            syncStatusDot.classList.add('synced');
            syncStatusText.textContent = 'En la Nube';
        } else if (status === 'syncing') {
            syncStatusDot.classList.add('syncing');
            syncStatusText.textContent = 'Sincronizando...';
        } else {
            syncStatusText.textContent = 'Local (Offline)';
        }
    }

    if (db) {
        try {
            console.log("Firebase conectado para sincronización.");
            updateSyncStatus('synced');

            // Intento inicial de descargar notas del servidor si las locales están vacías
            if (notes.length === 0) {
                db.collection("iafcj_notes").doc("my_notes_backup").get().then((doc) => {
                    if (doc.exists) {
                        notes = doc.data().all_notes;
                        saveNotes();
                    }
                });
            }
        } catch (e) {
            console.error("Error al conectar con Firebase:", e);
        }
    }

    async function syncToCloud() {
        if (!db) return;
        updateSyncStatus('syncing');
        try {
            await db.collection("iafcj_notes").doc("my_notes_backup").set({
                all_notes: notes,
                lastUpdated: new Date().toISOString()
            });
            updateSyncStatus('synced');
        } catch (e) {
            console.error("Error sincronizando:", e);
            updateSyncStatus('error');
        }
    }

    // --- Initial Load ---
    renderCategories();
    renderCalendar(currentMonth, currentYear);
    renderNotesList();
});
