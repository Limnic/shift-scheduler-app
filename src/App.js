import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously,
    signInWithCustomToken
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    onSnapshot,
    updateDoc,
    deleteDoc,
    Timestamp,
    serverTimestamp,
    getDocs
} from 'firebase/firestore';
import { ChevronDown, LogOut, Settings, Users, Briefcase, LayoutDashboard, Bell, Globe, Filter, Search, PlusCircle, Edit3, Trash2, Eye, XCircle, CheckCircle, AlertTriangle, Building, CalendarDays, Clock, ListChecks, UserCog, UserPlus, ShieldCheck, BarChart3 } from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'shift-app-react-v2'; 

// --- Contexts ---
const AuthContext = createContext(null);
const LanguageContext = createContext(null);
const DbContext = createContext(null);

// --- Translations ---
const translations = {
    en: {
        appName: "Shift Scheduler",
        welcome: "Welcome to Shift Scheduler",
        login: "Login",
        signup: "Sign Up",
        email: "Email Address",
        password: "Password",
        specialCode: "Special Code",
        logout: "Logout",
        settings: "Settings",
        dashboard: "Dashboard",
        shifts: "Shifts",
        availableShifts: "Available Shifts",
        apply: "Apply",
        postedBy: "Posted by",
        station: "Station",
        urgency: "Urgency",
        time: "Time",
        actions: "Actions",
        language: "Language",
        notifications: "Notifications",
        receiveNotifications: "Receive Notifications",
        selectServices: "Select services for notifications",
        saveSettings: "Save Settings",
        adminPanel: "Admin Panel",
        postNewShift: "Post New Shift",
        manageShifts: "Manage Shifts",
        statistics: "Statistics",
        itPanel: "IT Panel",
        manageStations: "Manage Stations",
        manageSchedules: "Manage Schedules",
        manageUsers: "Manage Users",
        filterShifts: "Filter Shifts",
        startDate: "Start Date",
        endDate: "End Date",
        timetable: "Timetable",
        search: "Search",
        noShiftsAvailable: "No shifts available at the moment.",
        role: "Role",
        user: "User",
        admin: "Administrator",
        itTech: "IT Technician",
        status: "Status",
        open: "Open",
        pending: "Pending Review",
        filled: "Filled",
        cancelled: "Cancelled",
        low: "Low",
        medium: "Medium",
        high: "High",
        shiftDetails: "Shift Details",
        applicants: "Applicants",
        assign: "Assign",
        noApplicants: "No applicants yet.",
        addStation: "Add Station",
        stationName: "Station Name",
        stationDescription: "Station Description (Optional)",
        add: "Add",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this item?",
        addSchedule: "Add Schedule",
        scheduleName: "Schedule Name",
        timeSlots: "Time Slots",
        addTimeSlot: "Add Time Slot",
        slotName: "Slot Name",
        startTime: "Start Time",
        endTime: "EndTime",
        users: "Users",
        changeRole: "Change Role",
        confirm: "Confirm",
        cancel: "Cancel",
        selectRole: "Select Role",
        selectStation: "Select Station",
        selectUrgency: "Select Urgency",
        shiftDate: "Shift Date",
        shiftStartTime: "Shift Start Time",
        shiftEndTime: "Shift End Time",
        notes: "Notes (Optional)",
        createShift: "Create Shift",
        updateShift: "Update Shift",
        loginError: "Login Failed. Please check your credentials.",
        signupError: "Signup Failed. Please check the details or the special code.",
        signupSuccess: "Signup successful! Please login.",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        actionFailed: "Action failed. Please try again.",
        actionSuccess: "Action successful.",
        profile: "Profile",
        myShifts: "My Shifts",
        backToShifts: "Back to Shifts",
        applied: "Applied",
        assigned: "Assigned",
        alreadyApplied: "You have already applied for this shift.",
        applicationSubmitted: "Application submitted successfully.",
        applicationWithdrawn: "Application withdrawn.",
        withdrawApplication: "Withdraw Application",
        viewApplicants: "View Applicants",
        approve: "Approve",
        reject: "Reject",
        approved: "Approved",
        rejected: "Rejected",
        applicationStatus: "Application Status",
        manageApplications: "Manage Applications",
        shiftManagement: "Shift Management",
        systemSettings: "System Settings",
        userManagement: "User Management",
        totalShifts: "Total Shifts",
        openShifts: "Open Shifts",
        filledShifts: "Filled Shifts",
        totalUsers: "Total Users",
        activeUsers: "Active Users (mock)",
        shiftsByStation: "Shifts by Station (mock)",
        fillRate: "Fill Rate (mock)",
        itUser: "IT User",
        selectLanguage: "Select Language",
        german: "German (Deutsch)",
        english: "English",
        portuguese: "Portuguese (Português)",
        welcomeMessage: "Manage your shifts efficiently.",
        loginToContinue: "Login to continue or sign up if you are new.",
        signupInstruction: "Use the special code provided by your administrator to sign up.",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loggingIn: "Logging in...",
        signingUp: "Signing up...",
        fetchingData: "Fetching data...",
        noData: "No data available.",
        all: "All",
        myApplications: "My Applications",
        manageShiftApplications: "Manage Shift Applications",
        applicationDate: "Application Date",
        applicantName: "Applicant Name",
        markAsFilled: "Mark as Filled",
        reopenShift: "Reopen Shift",
        cancelShift: "Cancel Shift",
        confirmCancelShift: "Are you sure you want to cancel this shift? This action cannot be undone.",
        confirmReopenShift: "Are you sure you want to reopen this shift?",
        confirmMarkAsFilled: "Are you sure you want to mark this shift as filled (manual override)?",
        shiftSuccessfullyCancelled: "Shift successfully cancelled.",
        shiftSuccessfullyReopened: "Shift successfully reopened.",
        shiftSuccessfullyMarkedFilled: "Shift successfully marked as filled.",
        userRoleUpdated: "User role updated successfully.",
        errorUpdatingRole: "Error updating user role.",
        deleteUser: "Delete User",
        confirmDeleteUser: "Are you sure you want to delete this user? This action is permanent.",
        userDeleted: "User deleted successfully.",
        errorDeletingUser: "Error deleting user.",
        backToWelcome: "Back to Welcome",
        allRightsReserved: "All rights reserved.",
        pageNotFound: "Page not found",
        featureComingSoon: "This feature is coming soon.",
        settingsSaved: "Settings saved successfully!",
        errorSavingSettings: "Error saving settings.",
        emergencyRoom: "Emergency Room",
        intensiveCareUnit: "Intensive Care Unit",
        surgery: "Surgery",
        noServicesAvailable: "No services available for notification.",

    },
    pt: {
        appName: "Agendador de Turnos",
        welcome: "Bem-vindo ao Agendador de Turnos",
        login: "Entrar",
        signup: "Inscrever-se",
        email: "Endereço de Email",
        password: "Senha",
        specialCode: "Código Especial",
        logout: "Sair",
        settings: "Configurações",
        dashboard: "Painel",
        shifts: "Turnos",
        availableShifts: "Turnos Disponíveis",
        apply: "Candidatar-se",
        postedBy: "Publicado por",
        station: "Posto",
        urgency: "Urgência",
        time: "Horário",
        actions: "Ações",
        language: "Idioma",
        notifications: "Notificações",
        receiveNotifications: "Receber Notificações",
        selectServices: "Selecione serviços para notificações",
        saveSettings: "Salvar Configurações",
        adminPanel: "Painel do Administrador",
        postNewShift: "Publicar Novo Turno",
        manageShifts: "Gerenciar Turnos",
        statistics: "Estatísticas",
        itPanel: "Painel de TI",
        manageStations: "Gerenciar Postos",
        manageSchedules: "Gerenciar Horários Fixos",
        manageUsers: "Gerenciar Usuários",
        filterShifts: "Filtrar Turnos",
        startDate: "Data de Início",
        endDate: "Data Final",
        timetable: "Horário",
        search: "Pesquisar",
        noShiftsAvailable: "Nenhum turno disponível no momento.",
        role: "Função",
        user: "Usuário",
        admin: "Administrador",
        itTech: "Técnico de TI",
        status: "Estado",
        open: "Aberto",
        pending: "Revisão Pendente",
        filled: "Preenchido",
        cancelled: "Cancelado",
        low: "Baixa",
        medium: "Média",
        high: "Alta",
        shiftDetails: "Detalhes do Turno",
        applicants: "Candidatos",
        assign: "Atribuir",
        noApplicants: "Nenhum candidato ainda.",
        addStation: "Adicionar Posto",
        stationName: "Nome do Posto",
        stationDescription: "Descrição do Posto (Opcional)",
        add: "Adicionar",
        edit: "Editar",
        delete: "Excluir",
        confirmDelete: "Tem certeza que deseja excluir este item?",
        addSchedule: "Adicionar Horário Fixo",
        scheduleName: "Nome do Horário Fixo",
        timeSlots: "Intervalos de Tempo",
        addTimeSlot: "Adicionar Intervalo",
        slotName: "Nome do Intervalo",
        startTime: "Hora de Início",
        endTime: "Hora de Fim",
        users: "Usuários",
        changeRole: "Mudar Função",
        confirm: "Confirmar",
        cancel: "Cancelar",
        selectRole: "Selecionar Função",
        selectStation: "Selecionar Posto",
        selectUrgency: "Selecionar Urgência",
        shiftDate: "Data do Turno",
        shiftStartTime: "Hora de Início do Turno",
        shiftEndTime: "Hora de Fim do Turno",
        notes: "Notas (Opcional)",
        createShift: "Criar Turno",
        updateShift: "Atualizar Turno",
        loginError: "Falha no login. Verifique suas credenciais.",
        signupError: "Falha no cadastro. Verifique os dados ou o código especial.",
        signupSuccess: "Cadastro realizado com sucesso! Por favor, faça login.",
        loading: "Carregando...",
        error: "Erro",
        success: "Sucesso",
        actionFailed: "Ação falhou. Por favor, tente novamente.",
        actionSuccess: "Ação realizada com sucesso.",
        profile: "Perfil",
        myShifts: "Meus Turnos",
        backToShifts: "Voltar aos Turnos",
        applied: "Candidatado",
        assigned: "Atribuído",
        alreadyApplied: "Você já se candidatou para este turno.",
        applicationSubmitted: "Candidatura enviada com sucesso.",
        applicationWithdrawn: "Candidatura retirada.",
        withdrawApplication: "Retirar Candidatura",
        viewApplicants: "Ver Candidatos",
        approve: "Aprovar",
        reject: "Rejeitar",
        approved: "Aprovado",
        rejected: "Rejeitado",
        applicationStatus: "Status da Candidatura",
        manageApplications: "Gerenciar Candidaturas",
        shiftManagement: "Gerenciamento de Turnos",
        systemSettings: "Configurações do Sistema",
        userManagement: "Gerenciamento de Usuários",
        totalShifts: "Total de Turnos",
        openShifts: "Turnos Abertos",
        filledShifts: "Turnos Preenchidos",
        totalUsers: "Total de Usuários",
        activeUsers: "Usuários Ativos (simulado)",
        shiftsByStation: "Turnos por Posto (simulado)",
        fillRate: "Taxa de Preenchimento (simulado)",
        itUser: "Usuário de TI",
        selectLanguage: "Selecionar Idioma",
        german: "Alemão (Deutsch)",
        english: "Inglês (English)",
        portuguese: "Português (Português)",
        welcomeMessage: "Gerencie seus turnos de forma eficiente.",
        loginToContinue: "Faça login para continuar ou cadastre-se se for novo.",
        signupInstruction: "Use o código especial fornecido pelo seu administrador para se inscrever.",
        noAccount: "Não tem uma conta?",
        haveAccount: "Já tem uma conta?",
        loggingIn: "Entrando...",
        signingUp: "Inscrevendo-se...",
        fetchingData: "Buscando dados...",
        noData: "Nenhum dado disponível.",
        all: "Todos",
        myApplications: "Minhas Candidaturas",
        manageShiftApplications: "Gerenciar Candidaturas de Turnos",
        applicationDate: "Data da Candidatura",
        applicantName: "Nome do Candidato",
        markAsFilled: "Marcar como Preenchido",
        reopenShift: "Reabrir Turno",
        cancelShift: "Cancelar Turno",
        confirmCancelShift: "Tem certeza que deseja cancelar este turno? Esta ação não pode ser desfeita.",
        confirmReopenShift: "Tem certeza que deseja reabrir este turno?",
        confirmMarkAsFilled: "Tem certeza que deseja marcar este turno como preenchido (substituição manual)?",
        shiftSuccessfullyCancelled: "Turno cancelado com sucesso.",
        shiftSuccessfullyReopened: "Turno reaberto com sucesso.",
        shiftSuccessfullyMarkedFilled: "Turno marcado como preenchido com sucesso.",
        userRoleUpdated: "Função do usuário atualizada com sucesso.",
        errorUpdatingRole: "Erro ao atualizar função do usuário.",
        deleteUser: "Excluir Usuário",
        confirmDeleteUser: "Tem certeza que deseja excluir este usuário? Esta ação é permanente.",
        userDeleted: "Usuário excluído com sucesso.",
        errorDeletingUser: "Erro ao excluir usuário.",
        backToWelcome: "Voltar à Página Inicial",
        allRightsReserved: "Todos os direitos reservados.",
        pageNotFound: "Página não encontrada",
        featureComingSoon: "Esta funcionalidade estará disponível em breve.",
        settingsSaved: "Configurações salvas com sucesso!",
        errorSavingSettings: "Erro ao salvar as configurações.",
        emergencyRoom: "Sala de Emergência",
        intensiveCareUnit: "Unidade de Terapia Intensiva",
        surgery: "Cirurgia",
        noServicesAvailable: "Nenhum serviço disponível para notificação.",
    },
    de: {
        appName: "Schichtplaner",
        welcome: "Willkommen beim Schichtplaner",
        login: "Anmelden",
        signup: "Registrieren",
        email: "E-Mail-Adresse",
        password: "Passwort",
        specialCode: "Spezialcode",
        logout: "Abmelden",
        settings: "Einstellungen",
        dashboard: "Dashboard",
        shifts: "Schichten",
        availableShifts: "Verfügbare Schichten",
        apply: "Bewerben",
        postedBy: "Veröffentlicht von",
        station: "Station",
        urgency: "Dringlichkeit",
        time: "Zeit",
        actions: "Aktionen",
        language: "Sprache",
        notifications: "Benachrichtigungen",
        receiveNotifications: "Benachrichtigungen erhalten",
        selectServices: "Dienste für Benachrichtigungen auswählen",
        saveSettings: "Einstellungen speichern",
        adminPanel: "Admin-Panel",
        postNewShift: "Neue Schicht erstellen",
        manageShifts: "Schichten verwalten",
        statistics: "Statistiken",
        itPanel: "IT-Panel",
        manageStations: "Stationen verwalten",
        manageSchedules: "Zeitpläne verwalten",
        manageUsers: "Benutzer verwalten",
        filterShifts: "Schichten filtern",
        startDate: "Startdatum",
        endDate: "Enddatum",
        timetable: "Zeitplan",
        search: "Suchen",
        noShiftsAvailable: "Momentan sind keine Schichten verfügbar.",
        role: "Rolle",
        user: "Benutzer",
        admin: "Administrator",
        itTech: "IT-Techniker",
        status: "Status",
        open: "Offen",
        pending: "Ausstehende Überprüfung",
        filled: "Besetzt",
        cancelled: "Abgesagt",
        low: "Niedrig",
        medium: "Mittel",
        high: "Hoch",
        shiftDetails: "Schichtdetails",
        applicants: "Bewerber",
        assign: "Zuweisen",
        noApplicants: "Noch keine Bewerber.",
        addStation: "Station hinzufügen",
        stationName: "Stationsname",
        stationDescription: "Stationsbeschreibung (Optional)",
        add: "Hinzufügen",
        edit: "Bearbeiten",
        delete: "Löschen",
        confirmDelete: "Sind Sie sicher, dass Sie dieses Element löschen möchten?",
        addSchedule: "Zeitplan hinzufügen",
        scheduleName: "Zeitplanname",
        timeSlots: "Zeitfenster",
        addTimeSlot: "Zeitfenster hinzufügen",
        slotName: "Slot-Name",
        startTime: "Startzeit",
        endTime: "Endzeit",
        users: "Benutzer",
        changeRole: "Rolle ändern",
        confirm: "Bestätigen",
        cancel: "Abbrechen",
        selectRole: "Rolle auswählen",
        selectStation: "Station auswählen",
        selectUrgency: "Dringlichkeit auswählen",
        shiftDate: "Schichtdatum",
        shiftStartTime: "Schichtbeginn",
        shiftEndTime: "Schichtende",
        notes: "Notizen (Optional)",
        createShift: "Schicht erstellen",
        updateShift: "Schicht aktualisieren",
        loginError: "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.",
        signupError: "Registrierung fehlgeschlagen. Bitte überprüfen Sie die Angaben oder den Spezialcode.",
        signupSuccess: "Registrierung erfolgreich! Bitte melden Sie sich an.",
        loading: "Wird geladen...",
        error: "Fehler",
        success: "Erfolg",
        actionFailed: "Aktion fehlgeschlagen. Bitte versuchen Sie es erneut.",
        actionSuccess: "Aktion erfolgreich.",
        profile: "Profil",
        myShifts: "Meine Schichten",
        backToShifts: "Zurück zu den Schichten",
        applied: "Beworben",
        assigned: "Zugewiesen",
        alreadyApplied: "Sie haben sich bereits für diese Schicht beworben.",
        applicationSubmitted: "Bewerbung erfolgreich abgeschickt.",
        applicationWithdrawn: "Bewerbung zurückgezogen.",
        withdrawApplication: "Bewerbung zurückziehen",
        viewApplicants: "Bewerber anzeigen",
        approve: "Genehmigen",
        reject: "Ablehnen",
        approved: "Genehmigt",
        rejected: "Abgelehnt",
        applicationStatus: "Bewerbungsstatus",
        manageApplications: "Bewerbungen verwalten",
        shiftManagement: "Schichtverwaltung",
        systemSettings: "Systemeinstellungen",
        userManagement: "Benutzerverwaltung",
        totalShifts: "Gesamte Schichten",
        openShifts: "Offene Schichten",
        filledShifts: "Besetzte Schichten",
        totalUsers: "Gesamte Benutzer",
        activeUsers: "Aktive Benutzer (simuliert)",
        shiftsByStation: "Schichten nach Station (simuliert)",
        fillRate: "Auslastung (simuliert)",
        itUser: "IT-Benutzer",
        selectLanguage: "Sprache auswählen",
        german: "Deutsch",
        english: "Englisch",
        portuguese: "Portugiesisch",
        welcomeMessage: "Verwalten Sie Ihre Schichten effizient.",
        loginToContinue: "Melden Sie sich an, um fortzufahren, oder registrieren Sie sich, wenn Sie neu sind.",
        signupInstruction: "Verwenden Sie den von Ihrem Administrator bereitgestellten Spezialcode, um sich zu registrieren.",
        noAccount: "Sie haben noch kein Konto?",
        haveAccount: "Sie haben bereits ein Konto?",
        loggingIn: "Anmelden...",
        signingUp: "Registrieren...",
        fetchingData: "Daten abrufen...",
        noData: "Keine Daten verfügbar.",
        all: "Alle",
        myApplications: "Meine Bewerbungen",
        manageShiftApplications: "Schichtbewerbungen verwalten",
        applicationDate: "Bewerbungsdatum",
        applicantName: "Name des Bewerbers",
        markAsFilled: "Als besetzt markieren",
        reopenShift: "Schicht wieder öffnen",
        cancelShift: "Schicht absagen",
        confirmCancelShift: "Sind Sie sicher, dass Sie diese Schicht absagen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
        confirmReopenShift: "Sind Sie sicher, dass Sie diese Schicht wieder öffnen möchten?",
        confirmMarkAsFilled: "Sind Sie sicher, dass Sie diese Schicht als besetzt markieren möchten (manuelle Übersteuerung)?",
        shiftSuccessfullyCancelled: "Schicht erfolgreich abgesagt.",
        shiftSuccessfullyReopened: "Schicht erfolgreich wieder geöffnet.",
        shiftSuccessfullyMarkedFilled: "Schicht erfolgreich als besetzt markiert.",
        userRoleUpdated: "Benutzerrolle erfolgreich aktualisiert.",
        errorUpdatingRole: "Fehler beim Aktualisieren der Benutzerrolle.",
        deleteUser: "Benutzer löschen",
        confirmDeleteUser: "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese Aktion ist dauerhaft.",
        userDeleted: "Benutzer erfolgreich gelöscht.",
        errorDeletingUser: "Fehler beim Löschen des Benutzers.",
        backToWelcome: "Zurück zur Startseite",
        allRightsReserved: "Alle Rechte vorbehalten.",
        pageNotFound: "Seite nicht gefunden",
        featureComingSoon: "Diese Funktion wird in Kürze verfügbar sein.",
        settingsSaved: "Einstellungen erfolgreich gespeichert!",
        errorSavingSettings: "Fehler beim Speichern der Einstellungen.",
        emergencyRoom: "Notaufnahme",
        intensiveCareUnit: "Intensivstation",
        surgery: "Chirurgie",
        noServicesAvailable: "Keine Dienste für Benachrichtigungen verfügbar.",
    },
};


const useLang = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        // This error should ideally be caught by an ErrorBoundary if it occurs post-initialization
        throw new Error("useLang must be used within a LanguageProvider. Ensure LanguageProvider is an ancestor.");
    }
    return context; // Return the whole context which includes { language, setLanguage, t }
};

const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('de'); // Default language
    const translateFunc = useCallback((key) => translations[language][key] || key, [language]);

    const authContext = useContext(AuthContext); 
    useEffect(() => {
        if (authContext?.currentUserData?.language) {
            setLanguage(authContext.currentUserData.language);
        }
    }, [authContext?.currentUserData?.language]);
    
    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translateFunc }}>
            {children}
        </LanguageContext.Provider>
    );
};

// --- Hooks ---
const useAuth = () => {
    return useContext(AuthContext);
};

const useDb = () => {
    return useContext(DbContext);
};


// --- AuthProvider ---
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                }
            } catch (error) {
                console.error("Error with initial auth token:", error);
            }

            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                setCurrentUser(user);
                if (user) {
                    const userDocRef = doc(db, `/artifacts/${appId}/users/${user.uid}`);
                    try {
                        const userDocSnap = await getDoc(userDocRef);
                        if (userDocSnap.exists()) {
                            setCurrentUserData({ id: user.uid, ...userDocSnap.data() });
                        } else {
                            // If doc doesn't exist, set basic data. 
                            // Subsequent updates using setDoc with merge:true will create/fill it.
                            setCurrentUserData({ 
                                id: user.uid, 
                                role: 'user', // Default role
                                email: user.email, 
                                language: 'de', // Default language
                                notificationPreferences: { globalEnable: true, subscribedServices: [] } // Default prefs
                            }); 
                            console.warn("User document not found in Firestore for UID:", user.uid, ". Basic data set. Document will be created/merged on next settings update.");
                        }
                    } catch (docError) {
                        console.error("Error fetching user document:", docError);
                        setCurrentUserData({ 
                            id: user.uid, 
                            role: 'user', 
                            email: user.email,
                            language: 'de',
                            notificationPreferences: { globalEnable: true, subscribedServices: [] }
                        }); 
                    }
                } else {
                    setCurrentUserData(null);
                }
                setLoading(false);
                setIsAuthReady(true);
            });
            return () => unsubscribe();
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password, specialCode) => {
        const codeRef = doc(db, `/artifacts/${appId}/public/config/specialCodes/${specialCode}`);
        const codeSnap = await getDoc(codeRef);

        if (!codeSnap.exists() || codeSnap.data().isUsed) {
            throw new Error("Invalid or used special code.");
        }
        const role = codeSnap.data().role || 'user'; 

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userProfileData = {
            email: user.email,
            role: role,
            language: 'de', 
            notificationPreferences: {
                globalEnable: true,
                subscribedServices: []
            },
            createdAt: serverTimestamp(),
            name: email.split('@')[0] 
        };
        // Use setDoc for signup to ensure document creation
        await setDoc(doc(db, `/artifacts/${appId}/users/${user.uid}`), userProfileData);
        await updateDoc(codeRef, { isUsed: true, usedBy: user.uid, usedAt: serverTimestamp() });
        
        return userCredential;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const updateUserLanguage = async (userId, lang) => {
        if (!userId) return false;
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}`);
        try {
            // Use setDoc with merge: true to create or update
            await setDoc(userDocRef, { language: lang }, { merge: true });
            setCurrentUserData(prev => prev ? ({ ...prev, language: lang }) : { id: userId, language: lang }); // Update local state
            return true;
        } catch (error) {
            console.error("Error updating language:", error);
            return false;
        }
    };
    
    const updateUserNotificationPreferences = async (userId, preferences) => {
        if (!userId) return false;
        const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}`);
        try {
            // Use setDoc with merge: true to create or update
            await setDoc(userDocRef, { notificationPreferences: preferences }, { merge: true });
            setCurrentUserData(prev => prev ? ({ ...prev, notificationPreferences: preferences }) : { id: userId, notificationPreferences: preferences }); // Update local state
            return true;
        } catch (error) {
            console.error("Error updating notification preferences:", error);
            return false;
        }
    };

    const value = {
        currentUser,
        currentUserData,
        loading,
        isAuthReady,
        login,
        signup,
        logout,
        updateUserLanguage,
        updateUserNotificationPreferences
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- DbProvider ---
const DbProvider = ({ children }) => {
    return <DbContext.Provider value={{ db, appId }}>{children}</DbContext.Provider>;
};


// --- Helper Components ---
const LoadingSpinner = ({ message }) => {
    const loadingMessage = message || globalTranslationsHelper('loading');
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-xl flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                <p className="text-lg font-medium text-gray-700">{loadingMessage}</p>
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText, cancelText, type = "info" }) => {
    const { t: translate } = useLang(); 
    if (!isOpen) return null;

    let titleColor = "text-blue-600";
    let IconComponent = AlertTriangle; 
    let iconColor = "text-blue-500";

    if (type === "error") {
      titleColor = "text-red-600";
      IconComponent = XCircle;
      iconColor = "text-red-500";
    } else if (type === "success") {
      titleColor = "text-green-600";
      IconComponent = CheckCircle;
      iconColor = "text-green-500";
    } else if (type === "warning") {
      titleColor = "text-yellow-600";
      IconComponent = AlertTriangle;
      iconColor = "text-yellow-500";
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-all">
                <div className="flex items-center mb-4">
                    <IconComponent className={`h-6 w-6 ${iconColor} mr-2`} />
                    <h3 className={`text-xl font-semibold ${titleColor}`}>{title}</h3>
                </div>
                <div className="text-gray-700 mb-6">
                    {children}
                </div>
                <div className="flex justify-end space-x-3">
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                        >
                            {confirmText || translate('confirm')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150"
                    >
                        {cancelText || translate('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main Application Structure ---
const App = () => {
    return (
        <AuthProvider>
            <DbProvider>
                <LanguageProvider>
                    <Router />
                </LanguageProvider>
            </DbProvider>
        </AuthProvider>
    );
};

// Global helper for translations, especially for early renders or outside full context
const globalTranslationsHelper = (key, lang = 'de') => translations[lang]?.[key] || key;


const Router = () => {
    const { currentUser, currentUserData, loading, isAuthReady } = useAuth();
    const [currentView, setCurrentView] = useState('welcome'); 

    useEffect(() => {
        if (!isAuthReady) { 
            return;
        }

        if (currentUser && currentUserData) {
            setCurrentView('app');
        } else if (!currentUser) { 
            if (currentView !== 'auth' && currentView !== 'welcome') {
                 setCurrentView('welcome');
            } else if (currentView === 'app') { 
                 setCurrentView('welcome');
            }
        }
    }, [currentUser, currentUserData, isAuthReady, currentView]);

    if (loading || !isAuthReady) { 
        return <LoadingSpinner message={globalTranslationsHelper('loading', 'de')} />; 
    }
    
    if (currentView === 'app' && currentUser && currentUserData) {
        return <MainAppLayout onNavigate={setCurrentView} />;
    }
    if (currentView === 'auth') {
        return <AuthScreen onNavigate={setCurrentView} />;
    }
    return <WelcomeScreen onNavigate={setCurrentView} />;
};


const WelcomeScreen = ({ onNavigate }) => {
    const { t: translate } = useLang(); 
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-6 text-white">
            <div className="text-center max-w-2xl">
                <Briefcase className="mx-auto h-20 w-20 text-sky-400 mb-6" />
                <h1 className="text-5xl font-bold mb-4">{translate('appName')}</h1>
                <p className="text-xl text-slate-300 mb-10">{translate('welcomeMessage')}</p>
                <p className="text-lg text-slate-400 mb-10">{translate('loginToContinue')}</p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                    <button
                        onClick={() => onNavigate('auth')} 
                        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105 text-lg"
                    >
                        {translate('login')} / {translate('signup')}
                    </button>
                </div>
            </div>
            <footer className="absolute bottom-6 text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} {translate('appName')}. {translate('allRightsReserved')}
            </footer>
        </div>
    );
};


const AuthScreen = ({ onNavigate }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login, signup, loading: authLoading } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialCode, setSpecialCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const { t: translate } = useLang();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await signup(email, password, specialCode);
                setSuccess(translate('signupSuccess'));
                setIsLoginView(true); 
                setEmail(''); 
                setPassword('');
                setSpecialCode('');
            }
        } catch (err) {
            setError((isLoginView ? translate('loginError') : translate('signupError')) + ` (${err.message})`);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            {(isSubmitting || authLoading) && <LoadingSpinner message={isLoginView ? translate('loggingIn') : translate('signingUp')} />}
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <Briefcase className="mx-auto h-16 w-16 text-sky-600 mb-4" />
                    <h2 className="text-3xl font-bold text-slate-800">{isLoginView ? translate('login') : translate('signup')}</h2>
                    {!isLoginView && <p className="text-slate-600 mt-2">{translate('signupInstruction')}</p>}
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">{translate('email')}</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">{translate('password')}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                    </div>
                    {!isLoginView && (
                        <div>
                            <label htmlFor="specialCode" className="block text-sm font-medium text-slate-700">{translate('specialCode')}</label>
                            <input
                                type="text"
                                id="specialCode"
                                value={specialCode}
                                onChange={(e) => setSpecialCode(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || authLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300"
                    >
                        {(isSubmitting || authLoading) ? (isLoginView ? translate('loggingIn') : translate('signingUp')) : (isLoginView ? translate('login') : translate('signup'))}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-slate-600">
                    {isLoginView ? translate('noAccount') : translate('haveAccount')}{' '}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); setSuccess('');}} className="font-medium text-sky-600 hover:text-sky-500">
                        {isLoginView ? translate('signup') : translate('login')}
                    </button>
                </p>
                 <p className="mt-4 text-center text-sm text-slate-600">
                    <button onClick={() => onNavigate('welcome')} className="font-medium text-slate-500 hover:text-slate-400">
                        &larr; {translate('backToWelcome')}
                    </button>
                </p>
            </div>
        </div>
    );
};


const MainAppLayout = ({ onNavigate }) => {
    const { currentUserData, logout } = useAuth();
    const { t: translate } = useLang();
    const [activeView, setActiveView] = useState('dashboard'); 
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    if (!currentUserData) {
        // This case should ideally be handled by the Router before MainAppLayout is even rendered.
        // If it still happens, logging out or redirecting might be an option,
        // but for now, LoadingSpinner is a safe fallback.
        console.warn("MainAppLayout rendered without currentUserData. This might indicate a routing issue.");
        return <LoadingSpinner message={translate('loading')} />;
    }

    const handleLogout = async () => {
        await logout();
        onNavigate('welcome'); 
    };
    
    const commonNavItems = [
        { id: 'dashboard', label: translate('dashboard'), icon: LayoutDashboard, roles: ['user', 'admin', 'it'] },
        { id: 'settings', label: translate('settings'), icon: Settings, roles: ['user', 'admin', 'it'] },
    ];

    const roleSpecificNavItems = {
        user: [
            { id: 'myShifts', label: translate('myShifts'), icon: ListChecks, roles: ['user'] },
        ],
        admin: [
            { id: 'manageShifts', label: translate('manageShifts'), icon: Briefcase, roles: ['admin'] },
            { id: 'statistics', label: translate('statistics'), icon: BarChart3, roles: ['admin'] },
        ],
        it: [
            { id: 'manageUsers', label: translate('manageUsers'), icon: UserCog, roles: ['it'] },
            { id: 'manageStations', label: translate('manageStations'), icon: Building, roles: ['it'] },
            { id: 'manageSchedules', label: translate('manageSchedules'), icon: CalendarDays, roles: ['it'] },
            { id: 'systemSettings', label: translate('systemSettings'), icon: ShieldCheck, roles: ['it'] }, 
        ]
    };
    
    const navRole = currentUserData?.role || 'user'; 
    const availableNavItems = [
        ...commonNavItems,
        ...(roleSpecificNavItems[navRole] || [])
    ].filter(item => item.roles.includes(navRole));


    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                if (navRole === 'user') return <UserDashboard />;
                if (navRole === 'admin') return <AdminDashboard setActiveView={setActiveView} />;
                if (navRole === 'it') return <ITDashboard setActiveView={setActiveView} />;
                return <div>{translate('dashboard')}</div>; 
            case 'settings':
                return <SettingsPanel />;
            case 'myShifts':
                return <MyShiftsView />; 
            case 'manageShifts':
                return <ManageShiftsView />; 
            case 'statistics':
                return <StatisticsView />; 
            case 'manageUsers':
                return <ManageUsersView />; 
            case 'manageStations':
                return <ManageStationsView />; 
            case 'manageSchedules':
                return <ManageSchedulesView />; 
            case 'systemSettings':
                return <SystemSettingsView />; 
            default:
                return <div>{translate('pageNotFound')}</div>;
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-100">
            <aside className={`bg-slate-800 text-slate-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}>
                <div className="px-4 mb-6 flex items-center space-x-3">
                    <Briefcase className="h-8 w-8 text-sky-400" />
                    <span className="text-2xl font-semibold">{translate('appName')}</span>
                </div>
                <nav>
                    {availableNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id); setShowMobileMenu(false); }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors
                                ${activeView === item.id ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>{translate('logout')}</span>
                    </button>
                    <div className="mt-2 text-center text-xs text-slate-400">
                        UID: {currentUserData?.id ? currentUserData.id.substring(0,8) : 'N/A'}...
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-slate-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="text-xl font-semibold text-slate-700">{availableNavItems.find(item => item.id === activeView)?.label || translate('appName')}</div>
                    <div></div>
                </header>
                
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

// --- Placeholder Dashboards and Views ---
const UserDashboard = () => {
    const { t: translate } = useLang();
    return (
        <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">{translate('availableShifts')}</h1>
            <p className="text-slate-600">{translate('noShiftsAvailable')}</p>
        </div>
    );
};

const AdminDashboard = ({ setActiveView }) => {
    const { t: translate } = useLang();
    return (
        <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">{translate('adminPanel')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('manageShifts')}>
                    <Briefcase className="h-10 w-10 text-sky-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('manageShifts')}</h2>
                    <p className="text-sm text-slate-500">{translate('postNewShift')}, view applications.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('statistics')}>
                    <BarChart3 className="h-10 w-10 text-green-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('statistics')}</h2>
                    <p className="text-sm text-slate-500">View shift fill rates, user activity.</p>
                </div>
            </div>
        </div>
    );
};

const ITDashboard = ({ setActiveView }) => {
    const { t: translate } = useLang();
    return (
        <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">{translate('itPanel')}</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('manageUsers')}>
                    <UserCog className="h-10 w-10 text-purple-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('manageUsers')}</h2>
                    <p className="text-sm text-slate-500">Manage user accounts and roles.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('manageStations')}>
                    <Building className="h-10 w-10 text-orange-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('manageStations')}</h2>
                    <p className="text-sm text-slate-500">Add or remove work stations.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('manageSchedules')}>
                    <CalendarDays className="h-10 w-10 text-teal-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('manageSchedules')}</h2>
                    <p className="text-sm text-slate-500">Define predefined shift schedules.</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveView('systemSettings')}>
                    <ShieldCheck className="h-10 w-10 text-red-500 mb-3" />
                    <h2 className="text-xl font-semibold text-slate-700 mb-1">{translate('systemSettings')}</h2>
                    <p className="text-sm text-slate-500">Manage special codes, etc.</p>
                </div>
            </div>
        </div>
    );
};

const SettingsPanel = () => {
    const { currentUserData, updateUserLanguage, updateUserNotificationPreferences } = useAuth();
    const { language, setLanguage, t: translate } = useLang(); 
    const [services, setServices] = useState([]); 
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [currentNotifPrefs, setCurrentNotifPrefs] = useState({
        globalEnable: true,
        subscribedServices: []
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (currentUserData?.notificationPreferences) {
            setCurrentNotifPrefs(currentUserData.notificationPreferences);
        }
        if (currentUserData?.language && currentUserData.language !== language) { 
            setLanguage(currentUserData.language); 
        }
    }, [currentUserData, language, setLanguage]);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingServices(true);
            const mockServices = [ 
                { id: 'service_ER', name: translate('emergencyRoom') },
                { id: 'service_ICU', name: translate('intensiveCareUnit') },
                { id: 'service_SURGERY', name: translate('surgery') },
            ];
            
            const servicesColRef = collection(db, `/artifacts/${appId}/public/data/services`);
            try {
                const snapshot = await getDocs(servicesColRef);
                if (snapshot.empty) {
                    for (const service of mockServices) {
                        if (service.name) {
                           await setDoc(doc(servicesColRef, service.id), { name: service.name });
                        } else {
                           console.warn(`Mock service ${service.id} has undefined name during setup.`);
                           await setDoc(doc(servicesColRef, service.id), { name: service.id }); 
                        }
                    }
                    setServices(mockServices.filter(s => s.name)); 
                } else {
                    setServices(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }
            } catch (error) {
                console.error("Error fetching/setting services:", error);
                setServices(mockServices.filter(s => s.name)); 
            }
            setIsLoadingServices(false);
        };
        if(translate && typeof translate === 'function'){ 
          fetchServices();
        }
    }, [translate, appId]); 

    const handleLanguageChange = async (e) => {
        const newLang = e.target.value;
        if (currentUserData?.id) {
            const success = await updateUserLanguage(currentUserData.id, newLang);
            if (success) {
                setLanguage(newLang); 
                setMessage({ type: 'success', text: translate('settingsSaved') });
            } else {
                setMessage({ type: 'error', text: translate('errorSavingSettings') });
            }
        }
    };

    const handleNotifPrefChange = (e) => {
        const { name, value, checked } = e.target; 
        if (name === "globalEnable") {
            setCurrentNotifPrefs(prev => ({ ...prev, globalEnable: checked }));
        } else if (name === "subscribedService") {
            setCurrentNotifPrefs(prev => {
                const currentSubs = prev.subscribedServices || [];
                if (checked) {
                    return { ...prev, subscribedServices: [...currentSubs, value] };
                } else {
                    return { ...prev, subscribedServices: currentSubs.filter(sId => sId !== value) };
                }
            });
        }
    };
    
    const handleSaveNotificationSettings = async () => {
        setMessage({type: '', text: ''}); 
        if (currentUserData?.id) {
            const success = await updateUserNotificationPreferences(currentUserData.id, currentNotifPrefs);
             if (success) {
                setMessage({ type: 'success', text: translate('settingsSaved') });
            } else {
                setMessage({ type: 'error', text: translate('errorSavingSettings') });
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-slate-800 mb-6">{translate('settings')}</h1>
            {message.text && (
                <div className={`p-3 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-3">{translate('language')}</h2>
                    <select
                        value={language} 
                        onChange={handleLanguageChange}
                        className="block w-full max-w-xs p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                    >
                        <option value="de">{translate('german')}</option>
                        <option value="en">{translate('english')}</option>
                        <option value="pt">{translate('portuguese')}</option>
                    </select>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-3">{translate('notifications')}</h2>
                    <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="globalEnable"
                                checked={currentNotifPrefs.globalEnable}
                                onChange={handleNotifPrefChange}
                                className="h-5 w-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                            />
                            <span>{translate('receiveNotifications')}</span>
                        </label>
                        {currentNotifPrefs.globalEnable && (
                            <div>
                                <h3 className="text-md font-medium text-slate-600 mb-2">{translate('selectServices')}</h3>
                                {isLoadingServices ? <p>{translate('loading')}...</p> : (
                                    <div className="space-y-1 max-h-48 overflow-y-auto border border-slate-200 p-3 rounded-md">
                                        {services.length > 0 ? services.map(service => (
                                            <label key={service.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="subscribedService"
                                                    value={service.id}
                                                    checked={(currentNotifPrefs.subscribedServices || []).includes(service.id)}
                                                    onChange={handleNotifPrefChange}
                                                    className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                                                />
                                                <span>{service.name}</span>
                                            </label>
                                        )) : <p className="text-slate-500 text-sm">{translate('noServicesAvailable')}</p>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                     <button 
                        onClick={handleSaveNotificationSettings}
                        className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
                    >
                        {translate('saveSettings')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Placeholder views for other sections (to be implemented)
const MyShiftsView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('myShifts')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const ManageShiftsView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('manageShifts')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const StatisticsView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('statistics')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const ManageUsersView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('manageUsers')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const ManageStationsView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('manageStations')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const ManageSchedulesView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('manageSchedules')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };
const SystemSettingsView = () => { const {t: translate} = useLang(); return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-2xl font-semibold text-slate-700">{translate('systemSettings')}</h2><p className="text-slate-500">{translate('featureComingSoon')}</p></div>; };


export default App;

