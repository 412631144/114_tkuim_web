
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('signup-form');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn'); 
    const Agree = document.getElementById('terms'); 
    

    
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
            group: document.getElementById('interests-group'),
            error: document.getElementById('interests-error')
        },
        terms: {
            input: document.getElementById('terms'),
            error: document.getElementById('terms-error')
        }
    };
    
    
    const strengthBar = document.getElementById('password-strength-bar').querySelector('.strength-bar-fill');
    const strengthText = document.getElementById('password-strength-text');

    
    const DRAFT_KEY = 'signupFormDraft';

    
    const touched = new Set();

    

   
    function setError(inputEl, errorEl, message) {
        if (message) {
            inputEl.classList.add('is-invalid');
            errorEl.textContent = message;
            const input = inputEl.id.includes('group') ? inputEl.querySelector('input') : inputEl;
            input.setCustomValidity(message);
        } else {
            inputEl.classList.remove('is-invalid');
            errorEl.textContent = '';
            const input = inputEl.id.includes('group') ? inputEl.querySelector('input') : inputEl;
            input.setCustomValidity('');
        }
    }


    function validateName() {
        const { input, error } = fields.name;
        let message = '';
        if (input.validity.valueMissing) {
            message = '請輸入姓名';
        }
        setError(input, error, message);
        return !message;
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
        updatePasswordStrength(value); 
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
        const checkedCount = group.querySelectorAll('input[name="interest"]:checked').length;
        let message = '';
        if (checkedCount === 0) {
            message = '請至少勾選 1 個興趣標籤';
        }
        setError(group, error, message);
        return !message;
    }

    function validateTerms() {
        const { input, error } = fields.terms;
        let message = '';
        if (input.validity.valueMissing) {
            message = '您必須同意服務條款';
        }
        setError(input, error, message);
        return !message;
    }
    
    function updatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++; 
        if (/[^A-Za-z0-9]/.test(password)) strength++;

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
    
    
    function validateAllFields() {
        Object.keys(fields).forEach(key => touched.add(key));
        const isValid = [
            validateName(),
            validateEmail(),
            validatePhone(),
            validatePassword(),
            validateConfirmPassword(),
            validateInterests(),
            validateTerms()
        ].every(Boolean);

        if (isValid) {
            return null;
        }
        const firstInvalid = form.querySelector('.is-invalid');
        return firstInvalid.querySelector('input') || firstInvalid;
    }
    

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

    loadDraft();

    form.addEventListener('input', (event) => {
        if (event.target.type !== 'password') {
            saveDraft();
        }
    });

    function setupListeners() {
        const textInputs = [fields.name, fields.email, fields.phone, fields.password, fields.confirmPassword];
        
        textInputs.forEach(({ input }) => {
            const fieldKey = input.id.replace(/-/g, '_');

            input.addEventListener('blur', () => {
                touched.add(fieldKey);
                validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (touched.has(fieldKey)) {
                    validateField(input);
                }
                if (input.id === 'password' && touched.has('confirmPassword')) {
                    validateConfirmPassword();
                }
            });
        });

        fields.interests.group.addEventListener('change', () => {
            touched.add('interests');
            validateInterests();
        });

        fields.terms.input.addEventListener('change', () => {
            touched.add('terms');
            validateTerms();
        });
    }
    
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


    resetBtn.addEventListener('click', () => {
        form.reset();
        Object.values(fields).forEach(field => {
            const el = field.input || field.group;
            setError(el, field.error, '');
        });
        touched.clear();
        localStorage.removeItem(DRAFT_KEY);
        updatePasswordStrength('');
    });


    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstInvalidField = validateAllFields();

        if (firstInvalidField) {
            firstInvalidField.focus();
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = '註冊中...';
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('註冊成功！');

            resetBtn.click(); 
            
            submitBtn.disabled = false;
            submitBtn.textContent = '立即註冊';
        }
    });

    Agree.addEventListener('click', () => {
        if (Agree.checked) {
        alert('同意嗎?');
        }
    });

});