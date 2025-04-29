import {Component, ElementRef, ViewChild} from '@angular/core';
import {ChatbotService} from "../../services/chatbot.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  userInput = '';
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  showChatWindow = false;  // 👈 Controls visibility

  constructor(private chatbotService: ChatbotService,private sanitizer: DomSanitizer) {}

  toggleChat() {
    this.showChatWindow = !this.showChatWindow;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ text: this.userInput, sender: 'user' });

    this.chatbotService.sendMessage(this.userInput).subscribe((res: any) => {
      this.messages.push({ text: res.reply, sender: 'bot' });
    });

    this.userInput = '';
  }

  @ViewChild('chatMessages') chatMessages!: ElementRef;

  ngAfterViewChecked() {
    if (this.chatMessages) {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }
  }

  formatReply(message: string): SafeHtml {
    const withLinks = message.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="font-size: inherit; font-weight: inherit;">Click here</a>'
    );
    return this.sanitizer.bypassSecurityTrustHtml(withLinks);
  }


}

