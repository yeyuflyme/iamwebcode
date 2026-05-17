let verificationModalInitialized = false;

const VerificationModal = {
    serverCode: '',
    envId: 'cloud1-9gd15iaj9f3be04d',
    TOKEN: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjlkMWRjMzFlLWI0ZDAtNDQ4Yi1hNzZmLWIwY2M2M2Q4MTQ5OCJ9.eyJpc3MiOiJodHRwczovL2Nsb3VkMS05Z2QxNWlhajlmM2JlMDRkLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJjbG91ZDEtOWdkMTVpYWo5ZjNiZTA0ZCIsImV4cCI6NDA4MDAwNjU5NiwiaWF0IjoxNzc2MzIzMzk2LCJub25jZSI6IlVoVFYtNE0tVFE2WDhQQXlKUEdhLXciLCJhdF9oYXNoIjoiVWhUVi00TS1UUTZYOFBBeUpQR2EtdyIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJjbG91ZDEtOWdkMTVpYWo5ZjNiZTA0ZCIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJ1c2VyX3R5cGUiOiIiLCJjbGllbnRfdHlwZSI6ImNsaWVudF91c2VyIiwiaXNfc3lzdGVtX2FkbWluIjpmYWxzZX0.B3sA2Gk871sXeOJbI2YZBekRfExOXXKp69DlEO5HIiDRGJgeKMlLZkCSisfPvyCJwmILZoXNt5pIwe_3jJmJNFIx0ZTuaGsWkfz0AQ6llm2aUx4ZoDEuhSnpy5vUIcbDZk2kB5RUzAghwhLqi3DDzO9OGfr2TmNq2yus-UULLFsXFMTzQZt26_A5QRkw1baldtwh7o64fP8_7NI1aqHWO-BoqC_aBuNN7qMub2Ip5mhzaGwaw03MjabhN4RY7Yz9MUhV84keEkhXeiK9bWGrWEfuLR3C7y3JTx7v80E_Xva7ZGC05yNQZrwA-Z53uLJfhdR-_pjI0RjZmB5_x2FWnw',
    resolve: null,
    init: async function() {
        await this.fetchQrCode();
        await this.fetchCode();
        document.getElementById('verificationModal').classList.remove('hidden');
        document.getElementById('verifyCodeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') VerificationModal.verifyCode();
        });
    },
    fetchQrCode: async function() {
        const url = `https://${this.envId}.api.tcloudbasegateway.com/v1/storages/get-objects-download-info`;
        const body = JSON.stringify([{ cloudObjectId: "cloud://cloud1-9gd15iaj9f3be04d.636c-cloud1-9gd15iaj9f3be04d-1422705586/小程序.png" }]);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.TOKEN },
                body: body
            });
            if (response.ok) {
                const data = await response.json();
                if (data[0] && data[0].downloadUrl) {
                    const qrImg = document.getElementById('qrCodeImg');
                    const qrLoading = document.getElementById('qrLoading');
                    qrImg.src = data[0].downloadUrl;
                    qrImg.style.display = 'block';
                    qrLoading.style.display = 'none';
                }
            }else{
                  const qrImg = document.getElementById('qrCodeImg');
                    const qrLoading = document.getElementById('qrLoading');
                    qrImg.src = "https://636c-cloud1-9gd15iaj9f3be04d-1422705586.tcb.qcloud.la/小程序.png";
                    qrImg.style.display = 'block';
                    qrLoading.style.display = 'none';
            }
        } catch (error) {   const qrImg = document.getElementById('qrCodeImg');
                    const qrLoading = document.getElementById('qrLoading');
                    qrImg.src = "https://636c-cloud1-9gd15iaj9f3be04d-1422705586.tcb.qcloud.la/小程序.png";
                    qrImg.style.display = 'block';
                    qrLoading.style.display = 'none';
                    document.getElementById('qrLoading').innerHTML = '微信搜索<br>我的安钥小盒'; }
    },
    fetchCode: async function() {
        const url = `https://${this.envId}.api.tcloudbasegateway.com/v1/functions/generateCode`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.TOKEN }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.code) this.serverCode = data.code;
            }
        } catch (error) {}
    },
    verifyCode: async function() {
        const inputCode = document.getElementById('verifyCodeInput').value.trim();
        if (!inputCode) {
            document.getElementById('errorText').textContent = '请输入验证码';
            document.getElementById('errorText').classList.add('show');
            return;
        }
        
        document.getElementById('errorText').classList.remove('show');
        
        try {
            const response = await fetch(`https://${this.envId}.api.tcloudbasegateway.com/v1/functions/generateCode`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.TOKEN }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.code) {
                    this.serverCode = data.code;
                    if (inputCode === this.serverCode) {
                        document.getElementById('verificationModal').classList.add('hidden');
                        document.getElementById('qrLoading').innerHTML = '微信搜索<br>我的安钥小盒';
                        document.getElementById('qrCodeImg').style.display = 'none';
                        document.getElementById('qrLoading').style.display = 'flex';
                        window.verifySuccess = true;
                        if (window.onVerifySuccess) window.onVerifySuccess();
                        
                        if (this.resolve) {
                            this.resolve(true);
                            this.resolve = null;
                        }
                    } else {
                        document.getElementById('errorText').textContent = '验证码错误，请重新输入';
                        document.getElementById('errorText').classList.add('show');
                        this.serverCode = '';
                    }
                }
            }
        } catch (error) {
            document.getElementById('errorText').textContent = '网络错误，请重试';
            document.getElementById('errorText').classList.add('show');
        }
    }
};

function loadVerificationModal() {
    return new Promise((resolve) => {
        if (verificationModalInitialized) {
            const modal = document.getElementById('verificationModal');
            if (modal) {
                modal.classList.remove('hidden');
                const codeInput = document.getElementById('verifyCodeInput');
                if (codeInput) codeInput.value = '';
                const errorText = document.getElementById('errorText');
                if (errorText) errorText.classList.remove('show');
                VerificationModal.fetchQrCode();
                VerificationModal.fetchCode();
            }
            VerificationModal.resolve = resolve;
            return;
        }
        verificationModalInitialized = true;

        const style = document.createElement('style');
        style.textContent = `
            .verification-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .verification-modal.hidden { display: none; }
            .modal-content {
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .modal-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px; }
            .qr-code-container { margin: 20px auto; width: 200px; }
            .qr-code-img { width: 200px; height: 200px; border-radius: 10px; object-fit: contain; display: none; margin: 0 auto; }
            .qr-code-loading { width: 200px; height: 200px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #f5f5f5; border-radius: 10px; color: #666; font-size: 14px; text-align: center; padding: 20px; }
            .modal-desc { color: #666; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
            .code-input-group { margin-bottom: 20px; }
            .code-input { width: 100%; padding: 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 18px; text-align: center; letter-spacing: 5px; }
            .code-input:focus { outline: none; border-color: #e91e63; }
            .verify-btn { width: 100%; padding: 15px; background: linear-gradient(145deg, #e91e63, #ff5722); color: white; border: none; border-radius: 10px; font-size: 18px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
            .verify-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(233, 30, 99, 0.4); }
            .error-text { color: #e91e63; font-size: 14px; margin-top: 10px; display: none; }
            .error-text.show { display: block; }
            @media (max-width: 480px) { .modal-content { padding: 30px 20px; } }
        `;
        document.head.appendChild(style);

        const html = `
            <div class="verification-modal" id="verificationModal">
                <div class="modal-content">
                    <div class="modal-title">扫码关注小程序</div>
                    <div class="qr-code-container">
                        <div class="qr-code-loading" id="qrLoading">微信搜索<br>我的安钥小盒</div>
                        <img class="qr-code-img" id="qrCodeImg" src="https://636c-cloud1-9gd15iaj9f3be04d-1422705586.tcb.qcloud.la/小程序.png" alt="微信搜索我的安钥小盒">
                    </div>
                    <div class="modal-desc">在"我的安钥小盒"小程序中查看验证码</div>
                    <div class="code-input-group">
                        <input type="text" class="code-input" id="verifyCodeInput" placeholder="请输入验证码" maxlength="6">
                        <div class="error-text" id="errorText">验证码错误，请重新输入</div>
                    </div>
                    <button class="verify-btn" onclick="VerificationModal.verifyCode()">验证</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        VerificationModal.resolve = resolve;
        VerificationModal.init();
    });
}
