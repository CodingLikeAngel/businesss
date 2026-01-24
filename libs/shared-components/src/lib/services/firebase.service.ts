import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../../../../../../environments/environment';

/**
 * Servicio de persistencia en Firebase (stub). En modo free simplemente guarda en localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private useFirebase: boolean = !!environment.firebaseConfig;

  constructor(private afAuth: AngularFireAuth, private afStore: AngularFirestore) {
    // Si no hay configuración, caemos en modo mock.
  }

  /** Guarda un proyecto completo (JSON) bajo el UID del usuario */
  async saveProject(projectId: string, data: any): Promise<void> {
    if (this.useFirebase) {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('User not authenticated');
      return this.afStore
        .collection('projects')
        .doc(`${user.uid}_${projectId}`)
        .set(data);
    } else {
      // Mock: guardamos en localStorage bajo clave única.
      localStorage.setItem(`fb_mock_${projectId}`, JSON.stringify(data));
    }
  }

  /** Carga un proyecto */
  async loadProject(projectId: string): Promise<any> {
    if (this.useFirebase) {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const doc = await this.afStore
        .collection('projects')
        .doc(`${user.uid}_${projectId}`)
        .get()
        .toPromise();
      return doc?.data();
    } else {
      const raw = localStorage.getItem(`fb_mock_${projectId}`);
      return raw ? JSON.parse(raw) : null;
    }
  }

  /** Lista los proyectos guardados del usuario */
  async listProjects(): Promise<string[]> {
    if (this.useFirebase) {
      const user = await this.afAuth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const snapshot = await this.afStore
        .collection('projects', ref => ref.where('owner', '==', user.uid))
        .get()
        .toPromise();
      return snapshot.docs.map(d => d.id);
    } else {
      // Mock: buscar claves en localStorage.
      const keys = Object.keys(localStorage).filter(k => k.startsWith('fb_mock_'));
      return keys.map(k => k.replace('fb_mock_', ''));
    }
  }
}
