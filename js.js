// Declaração das variáveis
var canvas, context, objects, currentObject = null;
var beginX = 0, beginX = 0; // Pocisçao do Mouse 
var startX = 0, startY = 0; // Dando o inicio ao desenho do objeto
var currentX, currentY;
var operation = null;
var unlockDraw = true;
var axis;

// html oculto select id = 'eixo de reflexão'
function hide(){
  var refection_axis = document.getElementById('refection_axis');
  refection_axis.style.visibility = 'hidden';
  axis = null;
}
//mostrar html select id = 'refletir eixo'
function show(){
  var refection_axis = document.getElementById('refection_axis');
  refection_axis.style.visibility = 'visible';
  axis = document.getElementById('refection_axis').value;
}

// Detectar eixo selecionado
document.getElementById('refection_axis').onchange = function(e) {
  axis = document.getElementById('refection_axis').value;
};

// Adicione um retângulo na lista e chame a função de atualização dessa tela de atualização.
function draw(startX, startY, currentX, currentY) {
  if(unlockDraw){
    objects.push({
      type: 'rect',
      x: startX, y: startY,
      width: currentX-startX, height: currentY-startY,
      color: '#000000'
    });
  }
  update();
}

// Verifique a operação do valor. Se este valor for igual a 'desenhar', então a operação de desenho não está ativada.
document.getElementById('transformation').onchange = function(e) {
  operation = document.getElementById('transformation').value;
  if (operation == 'draw'){
    unlockDraw = true;
  } 
  if (operation == 'reflect'){
    show();
  } else{
    hide();
  }
};

// Atualização da tela com objetos atualmente presentes na lista
function update() {
  context.fillStyle = '#f0f0f0';
  context.fillRect(0, 0, 600, 400);
  
  for (var i = 0; i < objects.length; i++) {
    context.fillStyle = objects[i].color;
    context.fillRect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
  }
  context.stroke();
}

// Ação da página de carregamento. Faça uma lista de objetos e elementos de tela.
window.onload = function() {
  objects = [];
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  update();
  hide(); // hiden html select id='reflect axis'
  
  // Detecta o objeto atual com a posição do mouse para baixo, se esta posição estiver na área de um determinado objeto
  canvas.onmousedown = function(event) {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].x < event.clientX
        && (objects[i].width + objects[i].x > event.clientX) &&  objects[i].y < event.clientY && (objects[i].height + objects[i].y > event.clientY)
        ) {
          currentObject = objects[i];
          beginX = event.clientX - objects[i].x;
          beginY = event.clientY - objects[i].y;
          unlockDraw = false;
          break;
        } else if(operation == 'draw'){
          beginX = event.clientX;
          beginY = event.clientY;
          unlockDraw = true;
        }
      }
    }
    
    // Detecta o objeto atual com o movimento do mouse
    canvas.onmousemove = function(event) {
      // Faça a tradução do objeto atual definida no evento mousedown.
      if (operation == 'translation' && currentObject != null) {
        currentObject.x = event.clientX - beginX;
        currentObject.y = event.clientY - beginY;
        update();
      }
      
      // Faça a escala do objeto atual definido no evento mousedown.
      if (operation == 'scale' && currentObject != null) {
        currentObject.width = event.clientX - currentObject.x;
        currentObject.height = event.clientY - currentObject.y;
        update();
      }
    }
    
    // Detecta o objeto atual com a posição do mouse para cima
    canvas.onmouseup = function(event) {
      // Faça a inclinação do objeto atual definido no evento mousedown.
      if (operation == 'skew'){
        context.save();
        context.transform(1,0.2,0,1,0,0);
      }
      
      // Faça o reflexo do objeto atual definido no evento mousedown.
      if (operation == 'reflect') {
        if (axis == 'x'){
          currentObject.x = canvas.width - (currentObject.x + currentObject.width);
        } else {          
          currentObject.y = canvas.height - (currentObject.y + currentObject.height);
        }
      }
      
      // Faça a rotação do objeto atual definido no evento mousedown.
      if (operation == 'rotate') {
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(15 * Math.PI / 180);
        context.translate(- canvas.width / 2, - canvas.height / 2);
      }
      
      
      // Adicione um retângulo transformado na lista e chame a função de atualização dessa tela de atualização.
      draw(startX, startY, currentX, currentY);
      update();
      // restaure o contexto final
      context.restore();
      // Defina o objeto atual como 'nulo' e as posições atuais como as posições atuais de movimento do mouse. 
      currentObject = null;
      currentX = event.clientX;
      currentY = event.clientY;
    }
  }