import Render from './assets/render/render';

export default async function Start(start: HTMLElement): Promise<void> {
  
    start.innerHTML = (`
        <div>
            <div id='moody'></div>
        </div>
    `)
  
    // Dynamically import and execute the Render function
    Render();
  }
  