/* 
   Parte 1: Atbash
   */
function cifrarAtbash(mensagem) {
  let resultado = '';
  for (let i = 0; i < mensagem.length; i++) {
    const ch = mensagem[i];
    const code = mensagem.charCodeAt(i);
    // A-Z: 65-90
    if (code >= 65 && code <= 90) {
      const idx = code - 65; 
      const mapped = 25 - idx;
      resultado += String.fromCharCode(65 + mapped);
    }
    // a-z: 97-122
    else if (code >= 97 && code <= 122) {
      const idx = code - 97;
      const mapped = 25 - idx;
      resultado += String.fromCharCode(97 + mapped);
    } else {
      resultado += ch;
    }
  }
  return resultado;
}

/* 
   Parte 2: César
    */
function cifrarCesar(mensagem, chave) {

  let resultado = '';
  const k = ((chave % 26) + 26) % 26; 

  for (let i = 0; i < mensagem.length; i++) {
    const ch = mensagem[i];
    const code = mensagem.charCodeAt(i);
    if (code >= 65 && code <= 90) { 
      const idx = code - 65;
      const novo = (idx + k) % 26;
      resultado += String.fromCharCode(65 + novo);
    } else if (code >= 97 && code <= 122) {
      const idx = code - 97;
      const novo = (idx + k) % 26;
      resultado += String.fromCharCode(97 + novo);
    } else {
      resultado += ch;
    }
  }
  return resultado;
}

/* 
   Parte 3: Vigenère
   */
function cifrarVigenere(mensagem, palavraChave, modo = 'codificar') {
  if (!palavraChave || palavraChave.length === 0) return mensagem;

  const shifts = [];
  for (let i = 0; i < palavraChave.length; i++) {
    const c = palavraChave[i];
    const code = palavraChave.charCodeAt(i);
    if (code >= 65 && code <= 90) shifts.push(code - 65);
    else if (code >= 97 && code <= 122) shifts.push(code - 97);
  }
  if (shifts.length === 0) return mensagem;

  const resultado = [];
  let keyIndex = 0;

  for (let i = 0; i < mensagem.length; i++) {
    const ch = mensagem[i];
    const code = mensagem.charCodeAt(i);

    if (code >= 65 && code <= 90) { 
      const shift = shifts[keyIndex % shifts.length];
      const idx = code - 65;
      const novo = modo === 'codificar'
        ? (idx + shift) % 26
        : (idx - shift + 26) % 26;
      resultado.push(String.fromCharCode(65 + novo));
      keyIndex++;
    } else if (code >= 97 && code <= 122) { 
      const shift = shifts[keyIndex % shifts.length];
      const idx = code - 97;
      const novo = modo === 'codificar'
        ? (idx + shift) % 26
        : (idx - shift + 26) % 26;
      resultado.push(String.fromCharCode(97 + novo));
      keyIndex++;
    } else {
      resultado.push(ch);
    }
  }

  return resultado.join('');
}

/* 
   Parte 4: RSA (Didático)
    */

function gerarChavesRSA_Didaticas(p, q) {
  if (p <= 1 || q <= 1) return null; 

  const N = p * q;
  const phi_N = (p - 1) * (q - 1);

  let E = 3;
  while (E < phi_N) {
    if ((phi_N % E !== 0) && ((p - 1) % E !== 0) && ((q - 1) % E !== 0)) {
      break;
    }
    E++;
  }

  let D = 1;
  while (D < phi_N) {
    if ((D * E) % phi_N === 1) {
      break;
    }
    D++;
  }

  return {
    publica: { E, N },
    privada: { D, N }
  };
}

function modPowBigInt(base, expoente, modulo) {
  base = BigInt(base) % BigInt(modulo);
  expoente = BigInt(expoente);
  modulo = BigInt(modulo);

  let resultado = 1n;
  let b = base;

  while (expoente > 0n) {
    if (expoente % 2n === 1n) {
      resultado = (resultado * b) % modulo;
    }
    b = (b * b) % modulo;
    expoente = expoente / 2n;
  }
  return resultado;
}


function cifrarRSA_Didatico(mensagem, E, N) {
  const Ebig = BigInt(E);
  const Nbig = BigInt(N);
  const arr = [];
  for (let i = 0; i < mensagem.length; i++) {
    const x = BigInt(mensagem.charCodeAt(i)); 
    const c = modPowBigInt(x, Ebig, Nbig); 
    
    arr.push(c.toString()); 
  }
  return arr;
}


function decifrarRSA_Didatico(mensagemCifrada, D, N) {
  const Dbig = BigInt(D);
  const Nbig = BigInt(N);
  let resultado = '';
  for (let i = 0; i < mensagemCifrada.length; i++) {
    const item = mensagemCifrada[i];
    const Cbig = BigInt(item);
    const orig = modPowBigInt(Cbig, Dbig, Nbig); 
    resultado += String.fromCharCode(Number(orig)); 
  }
  return resultado;
}

/* 
   Testes 
    */

console.log("=== Testes ===");

// Atbash
console.log("Atbash: ", cifrarAtbash("OlaMundo")); 


// César
console.log("César +3: ", cifrarCesar("criptografia", 3));
console.log("César -3: ", cifrarCesar("fulswrjudiia", -3));

// Vigenère
const chaveV = "CHAVE";
const codificadoV = cifrarVigenere("Enigma!", chaveV, 'codificar');
console.log("Vigenère codificado: ", codificadoV);
console.log("Vigenère decodificado: ", cifrarVigenere(codificadoV, chaveV, 'decodificar'));

// RSA
const PRIMO_1 = 17;
const PRIMO_2 = 19;
const CHAVES = gerarChavesRSA_Didaticas(PRIMO_1, PRIMO_2);

const textoOriginal = "OLA";
const cifradoRSA = cifrarRSA_Didatico(textoOriginal, CHAVES.publica.E, CHAVES.publica.N);
console.log("RSA Cifrado:", cifradoRSA);
const decifradoRSA = decifrarRSA_Didatico(cifradoRSA, CHAVES.privada.D, CHAVES.privada.N);
console.log("RSA Decifrado:", decifradoRSA);
