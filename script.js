const input_expressao = document.getElementById("input_expressao");
const input_limite_inferior = document.getElementById("input_limite_inferior");
const input_limite_superior = document.getElementById("input_limite_superior");
const input_numero_subintervalos = document.getElementById("input_numero_subintervalos");
const display = document.getElementById("display");
const mensagem_erro = document.getElementById("mensagem_erro");
const btn = document.getElementById("btn");

let expressao = input_expressao.value;
let l_inferior = input_limite_inferior.value;
let l_superior = input_limite_superior.value;
let n_subintervalos = input_numero_subintervalos.value;

let resultado;

input_expressao.addEventListener("input", (e) => {
  expressao = input_expressao.value;
  resultado = undefined;
  
  atualizar_display();
});

input_limite_inferior.addEventListener("input", () => {
    l_inferior = input_limite_inferior.value;
    resultado = undefined;

    
    const mensagem_erro = document.getElementById('erro_input_limite_inferior');
    if(mensagem_erro) mensagem_erro.parentNode.removeChild(mensagem_erro);
    
    if(l_superior && math.evaluate(l_inferior) > math.evaluate(l_superior)) {
      exibir_mensagem_erro("O limite inferior deve ser menor que o limite superior.", "erro_input_limite_inferior");
    }

    atualizar_display();
});

input_limite_superior.addEventListener("input", () => {
  l_superior = input_limite_superior.value;
  resultado = undefined;

  
  const mensagem_erro = document.getElementById('erro_input_limite_superior');
  if(mensagem_erro) mensagem_erro.parentNode.removeChild(mensagem_erro);
  
  if(l_inferior && math.evaluate(l_superior) < math.evaluate(l_inferior)) {
    exibir_mensagem_erro("O limite superior deve ser maior que o limite inferior.", "erro_input_limite_superior");
  }

  atualizar_display();
});

input_numero_subintervalos.addEventListener("input", () => {
  n_subintervalos = parseInt(input_numero_subintervalos.value);
  resultado = undefined;

  atualizar_display();
});

const simpson = (expressão, l_inferior, l_superior, n_subintervalos) => {
  const f = math.compile(expressão);
  
  l_superior = math.evaluate(l_superior);
  l_inferior = math.evaluate(l_inferior);

  const h = (l_superior - l_inferior) / (2 * n_subintervalos);

  let result = f.evaluate({x: l_inferior}) + f.evaluate({x: l_superior});

  for(let i = 1; i <= 2 * n_subintervalos - 1 ; i += 2) {
    result += 4 * f.evaluate({x: l_inferior + i * h});
  }

  for(let i = 2; i <= 2 * n_subintervalos - 2; i += 2) {
    result += 2 * f.evaluate({x: l_inferior + i * h});
  }

  return h / 3 * result;
}

const atualizar_display = () => {
  display.textContent = `$int_{${l_inferior}}^{${l_superior}} ${expressao} ${resultado ? "~~ " + resultado.toFixed(6) :""}$`;
  MathJax.typesetPromise(); 
}

const exibir_mensagem_erro = (mensagem, id) => {
  const erro = document.createElement('span');
  erro.id = id;
  erro.style.color = 'red';
  erro.style.display = "inline-block";
  erro.textContent = mensagem;

  mensagem_erro.appendChild(erro);
}

const calcular_integral = () => {
  return new Promise((resolve, reject) => {
    try {
      const resultado = simpson(expressao, l_inferior, l_superior, parseInt(n_subintervalos));
      resolve(resultado);
    } catch (erro) {
      reject(erro);
    }
  })
}

document.getElementById('form').addEventListener('submit', async event =>{
  event.preventDefault();

  if(l_inferior && l_superior && n_subintervalos && expressao) {

    resultado = await calcular_integral().catch(err => alert(err));

    console.log(resultado);
    
    atualizar_display();
  } else {
    const mensagem_erro = document.getElementById('erro_campo');
    if(mensagem_erro) mensagem_erro.parentNode.removeChild(mensagem_erro);

    exibir_mensagem_erro("Por favor, preencha todos os campos.", "erro_campo");
  }
});