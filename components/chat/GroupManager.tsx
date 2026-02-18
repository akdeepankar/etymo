'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { Trash2, LogOut, Plus, Search, ChevronRight } from 'lucide-react';

export default function GroupManager({ onGroupSelected, currentLanguage = 'en' }: { onGroupSelected: (group: any) => void; currentLanguage?: string }) {
    const [view, setView] = useState<'list' | 'create' | 'join'>('list');
    const [groups, setGroups] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    const GROUP_UI = {
        myGroups: "My Groups",
        createGroup: "Create Group",
        joinGroup: "Join Group",
        loading: "Loading...",
        noGroups: "No groups yet. Create or join one!",
        groupCode: "Code",
        delete: "Delete",
        leave: "Leave",
        createNewGroup: "Create New Group",
        joinAGroup: "Join a Group",
        groupName: "Group Name",
        groupCodePlaceholder: "Group Code (e.g. X8J2P)",
        cancel: "Cancel",
        create: "Create",
        join: "Join",
        invalidCode: "Invalid code",
        alreadyJoined: "You might already be in this group",
        confirmDelete: "Are you sure you want to delete this group? All messages will be lost.",
        confirmLeave: "Are you sure you want to leave this group?"
    };

    const [ui, setUi] = useState(GROUP_UI);

    useEffect(() => {
        const translateUI = async () => {
            if (currentLanguage === 'en') {
                setUi(GROUP_UI);
                return;
            }

            try {
                const cacheKey = `group_ui_cache_${currentLanguage}`;
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    setUi(JSON.parse(cached));
                    return;
                }

                const { translateObject } = await import('@/app/actions/translate');
                const translated = await translateObject(GROUP_UI, currentLanguage);
                setUi(translated as any);
                sessionStorage.setItem(cacheKey, JSON.stringify(translated));
            } catch (e) {
                console.error("Failed to translate Group UI", e);
            }
        };

        translateUI();
    }, [currentLanguage]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const { data, error } = await supabase
            .from('group_members')
            .select('group:groups(*)')
            .eq('user_id', user.id);

        if (data) {
            // Filter out null groups if any join failed
            setGroups(data.map((d: any) => d.group).filter(Boolean));
        }
        setLoading(false);
    };

    const createGroup = async () => {
        setLoading(true);
        if (!userId) return;

        const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const { data, error } = await supabase
            .from('groups')
            .insert({ name, join_code: uniqueCode, created_by: userId })
            .select()
            .single();

        if (error) {
            setMsg(error.message);
        } else {
            await supabase.from('group_members').insert({ group_id: data.id, user_id: userId });
            await fetchGroups();
            setView('list');
            setName('');
            // onGroupSelected(data.id); // Optional: Auto-enter
        }
        setLoading(false);
    };

    const joinGroup = async () => {
        setLoading(true);
        if (!userId) return;

        const { data: group, error: findError } = await supabase
            .from('groups')
            .select('id')
            .eq('join_code', code)
            .single();

        if (findError || !group) {
            setMsg(ui.invalidCode);
            setLoading(false);
            return;
        }

        const { error: joinError } = await supabase
            .from('group_members')
            .insert({ group_id: group.id, user_id: userId });

        if (joinError) {
            // Maybe already joined
            setMsg(ui.alreadyJoined);
        } else {
            await fetchGroups();
            setView('list');
            setCode('');
        }
        setLoading(false);
    };

    const deleteGroup = async (groupId: string) => {
        if (!confirm(ui.confirmDelete)) return;
        setLoading(true);
        await supabase.from('groups').delete().eq('id', groupId);
        await fetchGroups();
        setLoading(false);
    };

    const leaveGroup = async (groupId: string) => {
        if (!confirm(ui.confirmLeave)) return;
        setLoading(true);
        await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', userId);
        await fetchGroups();
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-4 p-4 text-white h-full">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">{ui.myGroups}</h2>
                        <div className="flex gap-2">
                            <button onClick={() => setView('create')} className="bg-blue-600 p-1.5 rounded hover:bg-blue-500" title={ui.createGroup}><Plus className="w-4 h-4" /></button>
                            <button onClick={() => setView('join')} className="bg-white/10 p-1.5 rounded hover:bg-white/20" title={ui.joinGroup}><Search className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                        {loading && groups.length === 0 && <p className="text-white/50 text-center text-xs">{ui.loading}</p>}
                        {!loading && groups.length === 0 && <p className="text-white/30 text-center text-xs py-4">{ui.noGroups}</p>}

                        {groups.map(group => (
                            <div key={group.id} className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-2 group hover:bg-white/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{group.name}</h3>
                                        <p className="text-[10px] text-white/50 font-mono">{ui.groupCode}: {group.join_code}</p>
                                    </div>
                                    <button
                                        onClick={() => onGroupSelected(group)}
                                        className="bg-blue-600/20 text-blue-300 p-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {group.created_by === userId ? (
                                        <button onClick={() => deleteGroup(group.id)} className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded">
                                            <Trash2 className="w-3 h-3" /> {ui.delete}
                                        </button>
                                    ) : (
                                        <button onClick={() => leaveGroup(group.id)} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 px-2 py-1 bg-orange-500/10 rounded">
                                            <LogOut className="w-3 h-3" /> {ui.leave}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {(view === 'create' || view === 'join') && (
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-md font-bold">{view === 'create' ? ui.createNewGroup : ui.joinAGroup}</h2>
                        <button onClick={() => setView('list')} className="text-xs text-white/50 hover:text-white">{ui.cancel}</button>
                    </div>
                    {msg && <p className="text-red-400 text-xs">{msg}</p>}

                    {view === 'create' ? (
                        <>
                            <input
                                className="bg-white/10 p-2 rounded text-sm outline-none placeholder:text-white/30"
                                placeholder={ui.groupName}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <button onClick={createGroup} disabled={loading} className="bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:opacity-50 text-sm font-bold">
                                {ui.create}
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                className="bg-white/10 p-2 rounded text-sm outline-none placeholder:text-white/30"
                                placeholder={ui.groupCodePlaceholder}
                                value={code}
                                onChange={e => setCode(e.target.value)}
                            />
                            <button onClick={joinGroup} disabled={loading} className="bg-green-600 p-2 rounded hover:bg-green-500 disabled:opacity-50 text-sm font-bold">
                                {ui.join}
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
