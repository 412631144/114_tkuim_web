// 確保 DOM 載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 元素選取 ---
    const form = document.getElementById('signup-form');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn'); // (進階)

    // 選取所有欄位與其錯誤訊息容器
    const fields = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('name-error')
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('email-error')
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('phone-error')
        },
        password: {
            input: document.getElementById('password'),
            error: document.getElementById('password-error')
        },
        confirmPassword: {
            input: document.getElementById('confirm-password'),
            error: document.getElementById('confirm-password-error')
        },
        interests: {
            // 注意：這裡是選取 "群組"
            group: document.getElementById('interests-group'),
            error: document.getElementById('interests-error')
        },
        terms: {
            input: document.getElementById('terms'),
            error: document.getElementById('terms-error')
        }
    };
    
    // (進階) 密碼強度條元素
    const strengthBar = document.getElementById('password-strength-bar').querySelector('.strength-bar-fill');
    const strengthText = document.getElementById('password-strength-text');

    // (進階) localStorage 鍵值
    const DRAFT_KEY = 'signupFormDraft';

    // 狀態：追蹤哪些欄位已被 "碰觸" (blur 過)
    const touched = new Set();

    // --- 2. 輔助函式 ---

    /**
     * 設置錯誤訊息
     * @param {HTMLElement} inputEl - 輸入欄位 (或群組)
     * @param {HTMLElement} errorEl - 錯誤訊息的 <p> 標籤
     * @param {string} message - 要顯示的訊息
     */
    function setError(inputEl, errorEl, message) {
        if (message) {
            inputEl.classList.add('is-invalid');
            errorEl.textContent = message;
            // 對 input 設置 setCustomValidity 以便 submit 攔截
            const input = inputEl.id.includes('group') ? inputEl.querySelector('input') : inputEl;
            input.setCustomValidity(message);
        } else {
            inputEl.classList.remove('is-invalid');
            errorEl.textContent = '';
            const input = inputEl.id.includes('group') ? inputEl.querySelector('input') : inputEl;
            input.setCustomValidity('');
        }
    }

    // --- 3. 驗證邏輯 (每個欄位一個函式) ---

    function validateName() {
        const { input, error } = fields.name;
        let message = '';
        if (input.validity.valueMissing) {
            message = '請輸入姓名';
        }
        setError(input, error, message);
        return !message; // true = 通過
    }

    function validateEmail() {
        const { input, error } = fields.email;
        let message = '';
        if (input.validity.valueMissing) {
            message = '請輸入 Email';
        } else if (input.validity.typeMismatch) {
            message = 'Email 格式不正確';
        }
        setError(input, error, message);
        return !message;
    }

    function validatePhone() {
        const { input, error } = fields.phone;
        let message = '';
        if (input.validity.valueMissing) {
            message = '請輸入手機號碼';
        } else if (input.validity.patternMismatch) {
            message = '請輸入 09 開頭的 10 碼手機號碼';
        }
        setError(input, error, message);
        return !message;
    }

    function validatePassword() {
        const { input, error } = fields.password;
        const value = input.value;
        const hasLetter = /[A-Za-z]/.test(value);
        const hasNumber = /\d/.test(value);
        let message = '';

        if (input.validity.valueMissing) {
            message = '請輸入密碼';
        } else if (input.validity.tooShort) {
            message = '密碼至少需 8 碼';
        } else if (!hasLetter || !hasNumber) {
            message = '請同時包含英文字母與數字';
        }
        
        setError(input, error, message);
        updatePasswordStrength(value); // (進階) 更新強度條
        return !message;
    }

    function validateConfirmPassword() {
        const { input, error } = fields.confirmPassword;
        const passwordValue = fields.password.input.value;
        let message = '';

        if (input.validity.valueMissing) {
            message = '請再次輸入密碼';
        } else if (input.value !== passwordValue) {
            message = '兩次輸入的密碼不一致';
        }
        setError(input, error, message);
        return !message;
    }

    function validateInterests() {
        const { group, error } = fields.interests;
        // 檢查群組內 "被選中" 的 checkbox 數量
        const checkedCount = group.querySelectorAll('input[name="interest"]:checked').length;
        let message = '';
        if (checkedCount === 0) {
            message = '請至少勾選 1 個興趣標籤';
        }
        // 注意：這裡是對 "group" 設置錯誤
        setError(group, error, message);
        return !message;
    }

    function validateTerms() {
        const { input, error } = fields.terms;
        let message = '';
        if (input.validity.valueMissing) { // 'required' 屬性會觸發 valueMissing
            message = '您必須同意服務條款';
        }
        setError(input, error, message);
        return !message;
    }
    
    // (進階) 更新密碼強度
    function updatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++; // 大寫
        if (/[a-z]/.test(password)) strength++; // 小寫
        if (/\d/.test(password)) strength++; // 數字
        if (/[^A-Za-z0-9]/.test(password)) strength++; // 符號

        let strengthName = '';
        if (strength <= 2) strengthName = 'weak';
        else if (strength <= 4) strengthName = 'medium';
        else strengthName = 'strong';
        
        if (password.length === 0) {
            strengthBar.dataset.strength = '';
            strengthText.textContent = '';
        } else {
            strengthBar.dataset.strength = strengthName;
            strengthText.textContent = `密碼強度: ${strengthName === 'weak' ? '弱' : strengthName === 'medium' ? '中' : '強'}`;
        }
    }
    
    /**
     * 運行所有驗證，並返回第一個錯誤的欄位
     * @returns {HTMLElement|null} - 第一個錯誤的欄位，或 null (如果都正確)
     */
    function validateAllFields() {
        // 標記全部為已碰觸
        Object.keys(fields).forEach(key => touched.add(key));

        // 依序執行所有驗證
        const isValid = [
            validateName(),
            validateEmail(),
            validatePhone(),
            validatePassword(),
            validateConfirmPassword(),
            validateInterests(),
            validateTerms()
        ].every(Boolean); // .every(Boolean) 檢查是否全部為 true

        if (isValid) {
            return null;
        }

        // 找到第一個錯誤的 "輸入欄位"
        const firstInvalid = form.querySelector('.is-invalid');
        // 如果是群組，聚焦到群組內的第一個 input
        return firstInvalid.querySelector('input') || firstInvalid;
    }
    
    // --- 4. (進階) localStorage 草稿功能 ---

    function saveDraft() {
        const draftData = {
            name: fields.name.input.value,
            email: fields.email.input.value,
            phone: fields.phone.input.value,
            interests: Array.from(fields.interests.group.querySelectorAll('input:checked')).map(cb => cb.id)
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }

    function loadDraft() {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            const data = JSON.parse(draft);
            fields.name.input.value = data.name || '';
            fields.email.input.value = data.email || '';
            fields.phone.input.value = data.phone || '';
            (data.interests || []).forEach(id => {
                const cb = document.getElementById(id);
                if (cb) cb.checked = true;
            });
        }
    }

    // --- 5. 事件監聽器 ---

    // (進階) 頁面載入時，讀取草稿
    loadDraft();

    // (進階) 任何輸入都保存草稿 (密碼欄位除外)
    form.addEventListener('input', (event) => {
        if (event.target.type !== 'password') {
            saveDraft();
        }
    });

    // 即時驗證：綁定 blur 和 input 事件
    function setupListeners() {
        const textInputs = [fields.name, fields.email, fields.phone, fields.password, fields.confirmPassword];
        
        textInputs.forEach(({ input }) => {
            const fieldKey = input.id.replace(/-/g, '_'); // e.g., confirm-password -> confirm_password

            // 1. blur 事件：標記為 "已碰觸" 並立即驗證
            input.addEventListener('blur', () => {
                touched.add(fieldKey);
                validateField(input);
            });
            
            // 2. input 事件：如果 "已碰觸"，則即時驗證
            input.addEventListener('input', () => {
                if (touched.has(fieldKey)) {
                    validateField(input);
                }
                // (特殊) 如果正在輸入密碼，也要即時重驗 "確認密碼"
                if (input.id === 'password' && touched.has('confirmPassword')) {
                    validateConfirmPassword();
                }
            });
        });

        // 3. 興趣標籤 (事件委派)
        fields.interests.group.addEventListener('change', () => {
            touched.add('interests');
            validateInterests();
        });

        // 4. 服務條款
        fields.terms.input.addEventListener('change', () => {
            touched.add('terms');
            validateTerms();
        });
    }
    
    /**
     * 根據 input 元素，呼叫對應的驗證函式
     * @param {HTMLElement} inputEl 
     */
    function validateField(inputEl) {
        switch(inputEl.id) {
            case 'name': validateName(); break;
            case 'email': validateEmail(); break;
            case 'phone': validatePhone(); break;
            case 'password': validatePassword(); break;
            case 'confirm-password': validateConfirmPassword(); break;
        }
    }

    setupListeners();


    // (進階) 重設按鈕
    resetBtn.addEventListener('click', () => {
        form.reset();
        // 清除所有錯誤樣式和訊息
        Object.values(fields).forEach(field => {
            const el = field.input || field.group;
            setError(el, field.error, '');
        });
        touched.clear();
        localStorage.removeItem(DRAFT_KEY);
        updatePasswordStrength(''); // 重設強度條
    });


    // 最終：送出攔截
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // 永遠先阻止預設送出

        const firstInvalidField = validateAllFields();

        if (firstInvalidField) {
            // 如果有欄位錯誤，聚焦到第一個錯誤的欄位
            firstInvalidField.focus();
        } else {
            // 所有欄位都正確
            // 1. 啟用防重送機制
            submitBtn.disabled = true;
            submitBtn.textContent = '註冊中...';
            
            // 2. 模擬 API 呼叫 (1秒)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. 顯示成功訊息
            alert('註冊成功！');

            // 4. 重設表單
            resetBtn.click(); // 觸發重設按鈕的邏輯
            
            // 5. 恢復按鈕
            submitBtn.disabled = false;
            submitBtn.textContent = '立即註冊';
        }
    });

});