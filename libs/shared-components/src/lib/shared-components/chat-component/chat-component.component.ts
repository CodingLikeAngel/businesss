import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { isPlatformBrowser } from '@angular/common';
import { UIInputComponent, UIButtonComponent } from '@negocio/ui-components';
import { AIService } from '../../../services/ai.service';

interface Appointment {
  id: number;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:MM
  description: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

@Component({
  selector: 'lib-chat-component',
  standalone: true,
  imports: [CommonModule, FormsModule, UIInputComponent, UIButtonComponent],
  templateUrl: './chat-component.component.html',
  styleUrls: ['./chat-component.component.scss'],
})
export class ChatComponentComponent implements OnInit {
  // Datos mockeados de citas
  private appointments: Appointment[] = [
    { id: 1, date: '2025-04-23', time: '10:00', description: 'Consulta médica' },
    { id: 2, date: '2025-04-23', time: '14:00', description: 'Reunión de trabajo' },
    { id: 3, date: '2025-04-24', time: '09:30', description: 'Cita dental' },
  ];

  chatMessages: ChatMessage[] = [];
  userInput = '';

  constructor(
    private aiService: AIService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    // Solo ejecuta el mensaje inicial en el cliente
    if (isPlatformBrowser(this.platformId)) {
      this.addBotMessage('¡Hola! Puedo ayudarte a gestionar reservas. Escribe "días libres", "agregar cita", o "eliminar cita".');
    }
  }

  // Agregar mensaje al chat
  private addBotMessage(text: string) {
    this.chatMessages.push({
      sender: 'bot',
      text,
      timestamp: this.getFormattedTimestamp(),
    });
  }

  private addUserMessage(text: string) {
    this.chatMessages.push({
      sender: 'user',
      text,
      timestamp: this.getFormattedTimestamp(),
    });
  }

  // Obtener timestamp compatible con SSR
  private getFormattedTimestamp(): string {
    if (isPlatformBrowser(this.platformId)) {
      return new Date().toLocaleTimeString();
    }
    // En el servidor, usa un formato simple
    return new Date().toISOString().split('T')[1].split('.')[0];
  }

  // Enviar mensaje del usuario
  sendMessage() {
    if (!this.userInput.trim()) return;

    this.addUserMessage(this.userInput);
    this.processCommand(this.userInput);
    this.userInput = '';
  }

  // Procesar comandos del usuario
  private processCommand(command: string) {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('días libres') || lowerCommand.includes('dias libres')) {
      this.getAvailableDays();
    } else if (lowerCommand.includes('agregar cita')) {
      this.promptAddAppointment();
    } else if (lowerCommand.includes('eliminar cita')) {
      this.promptDeleteAppointment();
    } else {
      // Solo envía a la IA en el cliente
      if (isPlatformBrowser(this.platformId)) {
        this.sendToAI(lowerCommand);
      } else {
        this.addBotMessage('Comando no disponible en el servidor. Usa "días libres", "agregar cita" o "eliminar cita".');
      }
    }
  }

  // Consultar días libres
  private getAvailableDays() {
    const today = new Date();
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const bookedDates = this.appointments.map((appt) => appt.date);
    const availableDays = next7Days.filter((date) => !bookedDates.includes(date));

    const response = availableDays.length
      ? `Días libres en los próximos 7 días: ${availableDays.join(', ')}`
      : 'No hay días libres en los próximos 7 días.';
    this.addBotMessage(response);
  }

  // Prompt para agregar cita
  private promptAddAppointment() {
    this.addBotMessage('Por favor, indica la fecha (YYYY-MM-DD), hora (HH:MM) y descripción de la cita, por ejemplo: "2025-04-25 15:00 Reunión".');
  }

  // Prompt para eliminar cita
  private promptDeleteAppointment() {
    const apptList = this.appointments
      .map((appt) => `${appt.id}: ${appt.date} ${appt.time} - ${appt.description}`)
      .join('\n');
    this.addBotMessage(`Indica el ID de la cita a eliminar. Citas actuales:\n${apptList}`);
  }

  // Enviar mensaje al servicio de IA
  private sendToAI(command: string) {
    const context = `
      Eres un asistente de reservas. Gestionas citas con una agenda. Los comandos válidos son:
      - "días libres": muestra días sin citas en los próximos 7 días.
      - "agregar cita": solicita fecha (YYYY-MM-DD), hora (HH:MM) y descripción.
      - "eliminar cita": solicita el ID de la cita a eliminar.
      Citas actuales: ${JSON.stringify(this.appointments)}.
      Responde de forma natural y procesa el siguiente mensaje: "${command}"
    `;

    this.aiService.sendMessage([context]).subscribe({
      next: (response) => {
        const aiResponse = this.aiService['useGemini']
          ? response.candidates[0].content.parts[0].text
          : response.choices[0].message.content;
        this.parseAIResponse(aiResponse, command);
      },
      error: (err) => {
        this.addBotMessage('Error al procesar la solicitud. Intenta de nuevo.');
        console.error(err);
      },
    });
  }

  // Parsear respuesta de la IA
  private parseAIResponse(aiResponse: string, originalCommand: string) {
    if (originalCommand.includes('agregar cita')) {
      const match = aiResponse.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.+)/);
      if (match) {
        const [, date, time, description] = match;
        this.addAppointment(date, time, description);
      } else {
        this.addBotMessage('Formato incorrecto. Usa: "YYYY-MM-DD HH:MM Descripción".');
      }
    } else if (originalCommand.includes('eliminar cita')) {
      const id = parseInt(aiResponse, 10);
      if (!isNaN(id)) {
        this.deleteAppointment(id);
      } else {
        this.addBotMessage('Por favor, indica un ID válido.');
      }
    } else {
      this.addBotMessage(aiResponse);
    }
  }

  // Agregar una cita
  private addAppointment(date: string, time: string, description: string) {
    const id = this.appointments.length ? Math.max(...this.appointments.map((a) => a.id)) + 1 : 1;
    this.appointments.push({ id, date, time, description });
    this.addBotMessage(`Cita agregada: ${date} ${time} - ${description}`);
  }

  // Eliminar una cita
  private deleteAppointment(id: number) {
    const index = this.appointments.findIndex((appt) => appt.id === id);
    if (index !== -1) {
      const [removed] = this.appointments.splice(index, 1);
      this.addBotMessage(`Cita eliminada: ${removed.date} ${removed.time} - ${removed.description}`);
    } else {
      this.addBotMessage('No se encontró una cita con ese ID.');
    }
  }
}