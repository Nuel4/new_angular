import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';
import { verticalMenuItems} from './theme/components/menu/menu'
@Injectable()
export class AppSettings {
    public settings = new Settings(
        'Yeats Clinical',
        'Yeats Clinical',
        {
            menu: 'vertical', //horizontal , vertical
            menuType: 'mini', //default, compact, mini
            showMenu: true,
            navbarIsFixed: true,
            footerIsFixed: false,
            sidebarIsFixed: true,
            showSideChat: false,
            sideChatIsHoverable: true,
            skin:'blue'  //light , dark, blue, green, combined, purple, orange, brown, grey, pink          
        }
    )
}


