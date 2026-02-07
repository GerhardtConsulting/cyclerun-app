# CycleRun Gamification & Social Concept

## 1. Punktesystem: "Energy" ⚡

Die Währung heißt **Energy** (EN) / **Energie** (DE).
Passt zum Fitness-Thema, funktioniert für Cycling UND Running, kurz & einprägsam.

### Punkte-Berechnung (pro Session)

| Quelle | Formel | Beispiel (30min, 15km, Ø25km/h) |
|---|---|---|
| **Basispunkte** | 1 Energy pro aktive Minute | 30 ⚡ |
| **Distanz-Bonus** | 10 Energy pro km | 150 ⚡ |
| **Speed-Bonus** | Ø-Speed × 0.5 (ab >15 km/h) | 12 ⚡ |
| **Tages-Erstfahrt** | +50 Energy (erste Session des Tages) | 50 ⚡ |
| **Streak-Multiplikator** | ×1.0 + (streak_days × 0.02), max ×1.5 | ×1.1 (5-Tage-Streak) |
| **Gesamt** | Summe × Streak-Multiplikator | ~266 ⚡ |

**Formel (SQL-kompatibel):**
```
base = duration_minutes + (distance_km × 10) + GREATEST(avg_speed - 15, 0) × 0.5
daily_bonus = 50 (wenn erste Session des Tages)
streak_mult = LEAST(1.0 + current_streak × 0.02, 1.5)
total_energy = ROUND((base + daily_bonus) × streak_mult)
```

Das System skaliert automatisch — längere/schnellere Rides = mehr Energy. Streaks belohnen Konsistenz.

---

## 2. Level-System

| Level | Name (EN) | Name (DE) | Energy benötigt | Typisch nach |
|---|---|---|---|---|
| 1 | Beginner | Anfänger | 0 | Registrierung |
| 2 | Rookie | Einsteiger | 500 | ~3 Rides |
| 3 | Regular | Aktiv | 2,000 | ~1-2 Wochen |
| 4 | Athlete | Sportler | 5,000 | ~1 Monat |
| 5 | Pro | Profi | 15,000 | ~3 Monate |
| 6 | Elite | Elite | 35,000 | ~6 Monate |
| 7 | Legend | Legende | 75,000 | ~1 Jahr |
| 8 | Immortal | Unsterblich | 150,000 | Langzeit |

Level wird automatisch aus `total_energy` berechnet — kein manuelles Tracking nötig.

---

## 3. Streak-System 🔥

- **Daily Streak**: Aufeinanderfolgende Tage mit mindestens 1 Session (≥5 Min.)
- **Streak Freeze**: Ab 7-Tage-Streak 1× pro Woche automatisch (verpasster Tag bricht Streak nicht)
- **Streak-Rekord**: Höchster jemals erreichter Streak wird gespeichert

### Streak-Belohnungen
| Streak | Bonus |
|---|---|
| 3 Tage | Badge "On Fire" 🔥 |
| 7 Tage | Badge "Week Warrior" + 1 Streak Freeze/Woche |
| 14 Tage | Badge "Unstoppable" |
| 30 Tage | Badge "Iron Will" |
| 100 Tage | Badge "Century Rider" |
| 365 Tage | Badge "Year of Sweat" |

---

## 4. Badge-System (Abzeichen)

Alle Badges werden **automatisch** nach jeder Session geprüft und vergeben.

### Kategorie: Distanz 🛣️
| Badge | Bedingung | Icon-Idee |
|---|---|---|
| First Kilometer | Gesamt ≥ 1 km | 🏁 |
| 10K Club | Gesamt ≥ 10 km | 🚴 |
| Half Century | Gesamt ≥ 50 km | 🗺️ |
| Century Rider | Gesamt ≥ 100 km | 🏅 |
| Tour de Force | Gesamt ≥ 500 km | 🏔️ |
| Thousand Miles | Gesamt ≥ 1,000 km | ⭐ |
| Ultra Distance | Gesamt ≥ 5,000 km | 🌍 |

### Kategorie: Dauer ⏱️
| Badge | Bedingung |
|---|---|
| First Ride | 1 Session abgeschlossen |
| Hour Power | Gesamt ≥ 1 Stunde |
| Ten Hour Club | Gesamt ≥ 10 Stunden |
| Marathon Mind | Gesamt ≥ 50 Stunden |
| Century Hours | Gesamt ≥ 100 Stunden |

### Kategorie: Speed 💨
| Badge | Bedingung |
|---|---|
| Speed Demon | Ø-Speed ≥ 30 km/h (in einer Session) |
| Sprint King | Max-Speed ≥ 40 km/h |
| Lightning | Max-Speed ≥ 50 km/h |

### Kategorie: Streak 🔥
| Badge | Bedingung |
|---|---|
| On Fire | 3-Tage-Streak |
| Week Warrior | 7-Tage-Streak |
| Unstoppable | 14-Tage-Streak |
| Iron Will | 30-Tage-Streak |
| Century Streak | 100-Tage-Streak |
| Year of Sweat | 365-Tage-Streak |

### Kategorie: Sessions 📊
| Badge | Bedingung |
|---|---|
| Getting Started | 5 Sessions |
| Regular | 25 Sessions |
| Dedicated | 100 Sessions |
| Obsessed | 500 Sessions |

### Kategorie: Spezial ✨
| Badge | Bedingung |
|---|---|
| Early Adopter | Registriert in der Beta-Phase |
| TV Pioneer | Erste Session im TV-Modus |
| Social Rider | Erste Multiplayer-Session (Future) |
| Night Rider | Session nach 22:00 Uhr |
| Early Bird | Session vor 07:00 Uhr |
| Weekend Warrior | Sessions an Sa + So in derselben Woche |

---

## 5. Leaderboard (Rangliste)

### Zeiträume
- **Woche** (Mo–So, Reset jeden Montag)
- **Monat** (Reset am 1.)
- **Gesamt** (All-Time)

### Kategorien
- **Total Energy** (Hauptrangliste)
- **Total Distance**
- **Longest Ride** (einzelne Session)

### Anonymisierung
Nutzer können ihren `display_name` setzen. Kein Klarname auf dem Leaderboard.

---

## 6. Nutzerprofil / Dashboard

### Übersicht
- **Level-Anzeige** mit Fortschrittsbalken zum nächsten Level
- **Total Energy** + Energy diese Woche
- **Aktuelle Streak** 🔥 mit Countdown zum nächsten Tag
- **Leaderboard-Position** (Woche + Gesamt)

### Statistiken
- Gesamtstrecke, Gesamtzeit, Durchschnittsgeschwindigkeit
- Diagramm: Aktivität der letzten 4 Wochen (Sessions pro Tag)
- Personal Records: Schnellste Session, Längste Session, Meiste Distanz

### Badge-Sammlung
- Grid aller Badges (freigeschaltet = farbig, gesperrt = grau)
- Fortschrittsanzeige bei teilweise erreichten Badges

---

## 7. Multiplayer & Challenges (Phase 2)

### Live Race
- Zwei Nutzer starten gleichzeitig, sehen gegenseitig Speed in Echtzeit
- Gewinner bekommt 2× Energy, Verlierer 1× (kein Verlust)
- Signaling über bestehende `pair_signals` Infrastruktur

### Ghost Mode
- Gegen eigenen besten Ride fahren
- Gegen Rides anderer Nutzer fahren (mit deren Erlaubnis)

### Weekly Challenge
- Automatische wöchentliche Herausforderung für alle
- z.B. "Fahre insgesamt 50 km diese Woche" → Bonus-Badge + 500 Energy
- Challenges rotieren automatisch

---

## 8. Autonomie des Systems

Das System ist **weitgehend autonom**:
1. **Nach jeder Session**: DB-Trigger berechnet Energy, prüft Badges, aktualisiert Streak
2. **Leaderboards**: SQL Views, keine manuelle Pflege
3. **Wöchentliche Challenges**: Rotierender Pool, automatisch ausgewählt
4. **Streak Freeze**: Automatisch vergeben ab 7-Tage-Streak
5. **Badges**: Neue Badges = 1 INSERT in `badges` Tabelle, Rest erledigt der Trigger

### Erweiterbarkeit
Neues Badge hinzufügen = 1 Zeile in `badges` Tabelle mit Bedingung als JSON:
```json
{
  "type": "total_distance",
  "operator": ">=",
  "value": 100,
  "unit": "km"
}
```
Der Trigger prüft ALLE Badges automatisch — kein Code-Deployment nötig.
