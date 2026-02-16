import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, AlertTriangle, XCircle } from 'lucide-react';

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(null);
  const [copied, setCopied] = useState(false);
  const [multiPasswords, setMultiPasswords] = useState([]);
  const [generateCount, setGenerateCount] = useState(5);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      alert('少なくとも1つの文字種を選択してください');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const generateMultiple = () => {
    const passwords = [];
    for (let i = 0; i < generateCount; i++) {
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let chars = '';
      if (includeUppercase) chars += uppercase;
      if (includeLowercase) chars += lowercase;
      if (includeNumbers) chars += numbers;
      if (includeSymbols) chars += symbols;

      let newPassword = '';
      for (let j = 0; j < length; j++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      passwords.push(newPassword);
    }
    setMultiPasswords(passwords);
  };

  const checkStrength = (pwd) => {
    if (!pwd) return null;

    let score = 0;
    const feedback = [];

    if (pwd.length >= 12) {
      score += 2;
    } else if (pwd.length >= 8) {
      score += 1;
    } else {
      feedback.push('8文字以上推奨');
    }

    if (/[a-z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('小文字を含めることを推奨');
    }

    if (/[A-Z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('大文字を含めることを推奨');
    }

    if (/[0-9]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('数字を含めることを推奨');
    }

    if (/[^a-zA-Z0-9]/.test(pwd)) {
      score += 2;
    } else {
      feedback.push('記号を含めることを推奨');
    }

    if (pwd.length >= 16) {
      score += 1;
    }

    let level = 'weak';
    let color = 'bg-red-500';
    let icon = XCircle;
    let text = '弱い';

    if (score >= 7) {
      level = 'strong';
      color = 'bg-green-500';
      icon = Shield;
      text = '強い';
    } else if (score >= 5) {
      level = 'medium';
      color = 'bg-yellow-500';
      icon = AlertTriangle;
      text = '普通';
    }

    return { score, level, color, icon, text, feedback, maxScore: 8 };
  };

  useEffect(() => {
    setStrength(checkStrength(password));
  }, [password]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('コピーに失敗しました');
    }
  };

  const StrengthIcon = strength?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">パスワード生成＆強度チェックツール</h1>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力または生成"
                className="flex-1 px-4 py-3 text-lg font-mono border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(password)}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                disabled={!password}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'コピー済' : 'コピー'}
              </button>
              <button
                onClick={generatePassword}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                生成
              </button>
            </div>

            {strength && password && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <StrengthIcon className={`w-6 h-6 ${strength.level === 'strong' ? 'text-green-600' : strength.level === 'medium' ? 'text-yellow-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-gray-700">強度: {strength.text}</span>
                  <span className="text-sm text-gray-500">({strength.score}/{strength.maxScore}点)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${strength.color}`}
                    style={{ width: `${(strength.score / strength.maxScore) * 100}%` }}
                  ></div>
                </div>
                {strength.feedback.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">改善提案:</p>
                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                      {strength.feedback.map((fb, idx) => (
                        <li key={idx}>{fb}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">生成オプション</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  文字数: {length}
                </label>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-700">大文字 (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-700">小文字 (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-700">数字 (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span className="text-gray-700">記号 (!@#$...)</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">一括生成</h2>
            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-700">生成数:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={generateCount}
                onChange={(e) => setGenerateCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={generateMultiple}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                一括生成
              </button>
            </div>

            {multiPasswords.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {multiPasswords.map((pwd, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2 p-2 bg-white rounded border border-gray-200">
                    <span className="flex-1 font-mono text-sm">{pwd}</span>
                    <button
                      onClick={() => copyToClipboard(pwd)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 パスワード管理のベストプラクティス</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• サービスごとに異なるパスワードを使用する</li>
              <li>• 16文字以上を推奨</li>
              <li>• 定期的にパスワードを変更する</li>
              <li>• パスワードマネージャーの使用を検討する</li>
              <li>• 二要素認証（2FA）を有効にする</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;