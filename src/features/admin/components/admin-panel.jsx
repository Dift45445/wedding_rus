import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Share2, Trash2, Plus, Save, Loader2, Edit2, X, List, Check } from "lucide-react";
import { generateInvitationLink } from "@/utils/generate-invitation-link";
import { getWeddingUid } from "@/lib/invitation-storage";
import { fetchInvitation, updateProgram, updateConfig, fetchWishes } from "@/services/api";

const STORAGE_KEY = "sakeenah_admin_personal_links";

export default function AdminPanel() {
  const [uid, setUid] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  // RSVP Data State
  const [rsvps, setRsvps] = useState([]);
  const [isLoadingRsvps, setIsLoadingRsvps] = useState(false);

  // Fetch RSVPs on load
  useEffect(() => {
    if (uid && uid.length > 3) {
      setIsLoadingRsvps(true);
      fetchWishes(uid, { limit: 100 })
        .then((res) => {
          if (res.success) {
            setRsvps(res.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoadingRsvps(false));
    }
  }, [uid]);

  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestPrefix, setGuestPrefix] = useState(""); // New state for prefix
  const [items, setItems] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Config State
  const [greetingPrefix, setGreetingPrefix] = useState("");
  const [invitationText, setInvitationText] = useState("");
  const [countdownText, setCountdownText] = useState(""); // New state for countdown text
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Program Editor State
  const [program, setProgram] = useState([]);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);
  const [isSavingProgram, setIsSavingProgram] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // { index, ...data } or null
  const [newItem, setNewItem] = useState({
    time: "",
    title: "",
    description: "",
    icon: "Clock",
  });

  useEffect(() => {
    const storedUid = getWeddingUid();
    if (storedUid) {
      setUid(storedUid);
    }
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      setItems([]);
    }
  }, []);

  // Fetch Program when UID is available
  useEffect(() => {
    if (uid && uid.length > 3) {
      setIsLoadingProgram(true);
      fetchInvitation(uid)
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.program) setProgram(res.data.program);
            setGreetingPrefix(res.data.greetingPrefix || "Уважаемые");
            setInvitationText(
              res.data.invitationText ||
                "Мы счастливы пригласить вас на нашу свадьбу!",
            );
            setCountdownText(res.data.countdownText || "До свадьбы осталось:");
          }
        })
        .catch((err) => console.error("Failed to fetch program", err))
        .finally(() => setIsLoadingProgram(false));
    }
  }, [uid]);

  const handleSaveConfig = async () => {
    if (!uid) return;
    setIsSavingConfig(true);
    try {
      await updateConfig(uid, { greetingPrefix, invitationText, countdownText });
      alert("Настройки успешно сохранены!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при сохранении настроек");
    } finally {
      setIsSavingConfig(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      setItems(items);
    }
  }, [items]);

  const normalizedBaseUrl = useMemo(() => {
    if (!baseUrl) return "";
    return baseUrl.replace(/\/+$/, "");
  }, [baseUrl]);

  const handleAdd = () => {
    if (!guestName.trim() || !uid.trim() || !normalizedBaseUrl) return;
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = {
      id,
      name: guestName.trim(),
      message: guestMessage.trim(),
      prefix: guestPrefix.trim(),
    };
    setItems((prev) => [newItem, ...prev]);
    setGuestName("");
    setGuestMessage("");
    setGuestPrefix("");
  };

  const handleCopy = async (id, link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  const handleShare = async (link, name) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Персональное приглашение",
          text: name,
          url: link,
        });
        return;
      } catch {
        return;
      }
    }
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Program Handlers
  const handleAddProgramItem = () => {
    if (!newItem.time || !newItem.title) return;
    setProgram([...program, newItem]);
    setNewItem({ time: "", title: "", description: "", icon: "Clock" });
  };

  const handleUpdateProgramItem = () => {
    if (!editingItem) return;
    const updatedProgram = [...program];
    updatedProgram[editingItem.index] = {
      time: editingItem.time,
      title: editingItem.title,
      description: editingItem.description,
      icon: editingItem.icon,
    };
    setProgram(updatedProgram);
    setEditingItem(null);
  };

  const handleRemoveProgramItem = (index) => {
    const updatedProgram = program.filter((_, i) => i !== index);
    setProgram(updatedProgram);
  };

  const handleSaveProgram = async () => {
    if (!uid) return;
    setIsSavingProgram(true);
    try {
      await updateProgram(uid, program);
      alert("Программа успешно сохранена!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при сохранении программы");
    } finally {
      setIsSavingProgram(false);
    }
  };

  const iconOptions = ["Clock", "MapPin", "Music", "Utensils", "Camera", "PartyPopper"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 pb-20">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* RSVP List Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6 sm:p-8">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-800">
              Ответы гостей (RSVP)
            </h1>
            <p className="text-gray-600">
              Просматривайте подтверждения присутствия и детали.
            </p>
          </div>

          {isLoadingRsvps ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-rose-50 text-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl w-1/4">Имя</th>
                    <th className="px-4 py-3 w-1/6">Статус</th>
                    <th className="px-4 py-3 rounded-r-xl">Комментарий</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 align-top">{rsvp.name}</td>
                      <td className="px-4 py-3 align-top">
                        <span className={`px-2 py-1 rounded text-xs inline-block ${
                          rsvp.attendance === 'ATTENDING' ? 'bg-green-100 text-green-700' :
                          rsvp.attendance === 'NOT_ATTENDING' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {rsvp.attendance === 'ATTENDING' ? 'Будет' :
                           rsvp.attendance === 'NOT_ATTENDING' ? 'Не будет' : 'Возможно'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-pre-wrap">{rsvp.message || '-'}</td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                        Пока нет ответов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Personal Links Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6 sm:p-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-800">
              Персональные ссылки
            </h1>
            <p className="text-gray-600">
              Создайте личное обращение для самых близких и получите отдельную
              ссылку.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">UID приглашения</label>
                <input
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-gray-700 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  placeholder="alexey-sofia-2026"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Базовый адрес</label>
                <input
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-gray-700 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  placeholder="https://вашдомен.ру"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Обращение</label>
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-gray-700 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  placeholder="Любимая Мама"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Префикс (например: Дорогая, Уважаемый)</label>
                <input
                  value={guestPrefix}
                  onChange={(e) => setGuestPrefix(e.target.value)}
                  className="w-full rounded-xl border border-rose-100 px-4 py-2.5 text-gray-700 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                  placeholder="Уважаемые (оставьте пустым для значения по умолчанию)"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Персональный текст (опционально)</label>
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  className="w-full min-h-[110px] rounded-xl border border-rose-100 px-4 py-2.5 text-gray-700 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 resize-none"
                  placeholder="Спасибо за поддержку и любовь. Нам очень важно, что вы рядом."
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-xl shadow hover:bg-rose-600 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Добавить
              </button>
            </div>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-2 text-sm text-gray-500 pb-2 border-b border-rose-100">
              <span>Обращение</span>
              <span>Ссылка</span>
            </div>
            <div className="divide-y divide-rose-50">
              {items.length === 0 && (
                <div className="py-6 text-sm text-gray-500">
                  Пока нет личных обращений
                </div>
              )}
              {items.map((item) => {
                const link = generateInvitationLink(
                  uid.trim(),
                  item.name,
                  normalizedBaseUrl,
                  item.message,
                  item.prefix,
                );
                return (
                  <div
                    key={item.id}
                    className="py-4 grid grid-cols-2 gap-4 items-start"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-gray-800">
                        {item.name}
                      </div>
                      {item.message && (
                        <div className="text-sm text-gray-500">
                          {item.message}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-rose-500 break-all">
                        {link}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleCopy(item.id, link)}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === item.id ? "Скопировано" : "Скопировать"}
                        </button>
                        <button
                          onClick={() => handleShare(link, item.name)}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          Поделиться
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Program Editor Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-rose-100 p-6 sm:p-8">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-800">
              Редактор программы
            </h1>
            <p className="text-gray-600">
              Управляйте расписанием свадебного дня.
            </p>
          </div>

          {isLoadingProgram ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* List of Items */}
              <div className="space-y-4">
                {program.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-500">{item.time}</span>
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {item.icon}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem({ index, ...item })}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveProgramItem(index)}
                        className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {program.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Программа пока пуста
                  </div>
                )}
              </div>

              {/* Add/Edit Form */}
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-4">
                <h3 className="font-medium text-gray-800">
                  {editingItem ? "Редактировать событие" : "Добавить событие"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Время (15:00)"
                    value={editingItem ? editingItem.time : newItem.time}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, time: e.target.value })
                        : setNewItem({ ...newItem, time: e.target.value })
                    }
                    className="w-full rounded-xl border border-rose-100 px-4 py-2"
                  />
                  <input
                    placeholder="Название (Сбор гостей)"
                    value={editingItem ? editingItem.title : newItem.title}
                    onChange={(e) =>
                      editingItem
                        ? setEditingItem({ ...editingItem, title: e.target.value })
                        : setNewItem({ ...newItem, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-rose-100 px-4 py-2"
                  />
                </div>
                <textarea
                  placeholder="Описание"
                  value={editingItem ? editingItem.description : newItem.description}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, description: e.target.value })
                      : setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-rose-100 px-4 py-2 resize-none h-20"
                />
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      onClick={() =>
                        editingItem
                          ? setEditingItem({ ...editingItem, icon })
                          : setNewItem({ ...newItem, icon })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors whitespace-nowrap ${
                        (editingItem ? editingItem.icon : newItem.icon) === icon
                          ? "bg-rose-500 text-white border-rose-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {editingItem ? (
                    <>
                      <button
                        onClick={handleUpdateProgramItem}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                      >
                        Обновить
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleAddProgramItem}
                      className="w-full bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Добавить
                    </button>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-rose-100">
                <button
                  onClick={handleSaveProgram}
                  disabled={isSavingProgram}
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-xl shadow hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProgram ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isSavingProgram ? "Сохранение..." : "Сохранить изменения"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
