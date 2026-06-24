'use client';

import { useState, useEffect, useCallback } from 'react';
import RichEditor from '@/components/rich-editor';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Save,
  ArrowLeft,
  BarChart3,
  Copy,
  Check,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  tag: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  focusKeyword: string | null;
  correctionNotes: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'list' | 'edit' | 'create';
type SeoTab = 'editor' | 'seo' | 'correction';

const EMPTY_ARTICLE: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tag: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  focusKeyword: '',
  correctionNotes: '',
  publishedAt: null,
};

/* ------------------------------------------------------------------ */
/*  SEO Score Helper                                                   */
/* ------------------------------------------------------------------ */
function getSeoScore(article: Partial<Article>): { score: number; items: { label: string; ok: boolean }[] } {
  const items = [
    { label: 'Meta titre renseigné', ok: !!article.seoTitle && article.seoTitle.length >= 30 },
    { label: 'Meta titre < 60 caractères', ok: !article.seoTitle || article.seoTitle.length <= 60 },
    { label: 'Meta description renseignée', ok: !!article.seoDescription && article.seoDescription.length >= 50 },
    { label: 'Meta desc. < 160 caractères', ok: !article.seoDescription || article.seoDescription.length <= 160 },
    { label: 'Mot-clé focal défini', ok: !!article.focusKeyword },
    { label: 'Tag / catégorie défini', ok: !!article.tag },
    { label: 'Extrait renseigné', ok: !!article.excerpt && article.excerpt.length > 50 },
    { label: 'Slug personnalisé', ok: !!article.slug && article.slug.length > 3 },
  ];
  const okCount = items.filter((i) => i.ok).length;
  return { score: Math.round((okCount / items.length) * 100), items };
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: typeof FileText }> = {
    draft: { label: 'Brouillon', className: 'bg-cloud text-iron border-mist', icon: FileText },
    review: { label: 'En correction', className: 'bg-brand-yellow-solid/40 text-graphite border-brand-yellow-solid', icon: AlertCircle },
    published: { label: 'Publié', className: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
  };
  const c = config[status] || config.draft;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-roboto font-medium px-2 py-0.5 border rounded-[2px] ${c.className}`}>
      <Icon size={11} />
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin Panel                                                   */
/* ------------------------------------------------------------------ */
export default function ArticleAdmin({ onClose }: { onClose: () => void }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('list');
  const [current, setCurrent] = useState<Partial<Article>>(EMPTY_ARTICLE);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [seoTab, setSeoTab] = useState<SeoTab>('editor');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------- CRUD handlers ---------- */
  const handleSave = async () => {
    if (!current.title?.trim()) {
      showToast('Le titre est obligatoire');
      return;
    }
    setSaving(true);
    try {
      if (view === 'create') {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current),
        });
        if (!res.ok) throw new Error();
        showToast('Article créé avec succès');
      } else if (editId) {
        const res = await fetch(`/api/articles/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current),
        });
        if (!res.ok) throw new Error();
        showToast('Article mis à jour');
      }
      await fetchArticles();
      setView('list');
      setCurrent(EMPTY_ARTICLE);
      setEditId(null);
    } catch {
      showToast("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirm(null);
      showToast('Article supprimé');
    } catch {
      showToast('Erreur lors de la suppression');
    }
  };

  const handleEdit = (article: Article) => {
    setCurrent(article);
    setEditId(article.id);
    setView('edit');
    setSeoTab('editor');
  };

  const handleNew = () => {
    setCurrent(EMPTY_ARTICLE);
    setEditId(null);
    setView('create');
    setSeoTab('editor');
  };

  /* ---------- Slug auto-gen ---------- */
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  /* ---------- Filter ---------- */
  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tag?.toLowerCase().includes(search.toLowerCase()) ||
      a.status.includes(search.toLowerCase())
  );

  /* ---------- SEO ---------- */
  const seo = getSeoScore(current);

  const copySlug = () => {
    if (current.slug) {
      navigator.clipboard.writeText(current.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  /* ================================================================ */
  /*  LIST VIEW                                                        */
  /* ================================================================ */
  if (view === 'list') {
    return (
      <div className="fixed inset-0 z-[100] bg-obsidian flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="font-oswald font-bold text-[20px] text-white">
              Gestion des articles
            </h2>
            <span className="text-[12px] font-roboto text-fog">
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 bg-brand-blue text-white text-[13px] font-roboto font-medium px-4 py-2 rounded-[2px] hover:bg-brand-blue/90 transition-colors"
            >
              <Plus size={16} />
              Nouvel article
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-fog hover:text-white border border-white/10 rounded-[2px] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="relative max-w-[360px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, tag ou statut..."
              className="w-full bg-white/5 border border-white/10 rounded-[2px] pl-9 pr-3 py-2 text-[13px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-fog text-[14px]">
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <FileText size={32} className="text-steel" />
              <p className="text-fog text-[14px]">
                {search ? 'Aucun résultat trouvé' : 'Aucun article pour le moment'}
              </p>
              {!search && (
                <button
                  onClick={handleNew}
                  className="text-[13px] font-roboto font-medium text-brand-blue-light hover:text-white transition-colors"
                >
                  Créer votre premier article
                </button>
              )}
            </div>
          ) : (
            <div className="border border-white/10 rounded-[2px] overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-4 py-2.5 bg-white/5 text-[11px] font-roboto font-medium text-fog uppercase tracking-wider">
                <span>Article</span>
                <span>Tag</span>
                <span>Statut</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}
              {filtered.map((article) => (
                <div
                  key={article.id}
                  className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-4 py-3 border-t border-white/5 hover:bg-white/3 transition-colors items-center"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-roboto font-medium text-white truncate">
                      {article.title}
                    </p>
                    <p className="text-[11px] font-roboto text-steel truncate mt-0.5">
                      /{article.slug}
                    </p>
                  </div>
                  <div>
                    {article.tag ? (
                      <span className="text-[11px] font-roboto font-medium text-brand-blue-light bg-brand-blue/10 px-2 py-0.5 rounded-[2px]">
                        {article.tag}
                      </span>
                    ) : (
                      <span className="text-[11px] font-roboto text-steel">—</span>
                    )}
                  </div>
                  <div>
                    <StatusBadge status={article.status} />
                  </div>
                  <div>
                    <p className="text-[11px] font-roboto text-steel">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(article)}
                      className="w-7 h-7 flex items-center justify-center text-fog hover:text-white transition-colors rounded-[2px] hover:bg-white/5"
                      title="Éditer"
                    >
                      <Pencil size={14} />
                    </button>
                    {article.status === 'draft' && (
                      <button
                        onClick={() => {
                          setCurrent(article);
                          setEditId(article.id);
                          setView('edit');
                          setSeoTab('correction');
                        }}
                        className="w-7 h-7 flex items-center justify-center text-fog hover:text-brand-blue-light transition-colors rounded-[2px] hover:bg-white/5"
                        title="Corriger"
                      >
                        <AlertCircle size={14} />
                      </button>
                    )}
                    {deleteConfirm === article.id ? (
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors rounded-[2px] hover:bg-red-500/10"
                        title="Confirmer"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(article.id)}
                        className="w-7 h-7 flex items-center justify-center text-fog hover:text-red-400 transition-colors rounded-[2px] hover:bg-white/5"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-pure-black text-[13px] font-roboto font-medium px-4 py-2.5 rounded-[2px] shadow-sm-2 z-10">
            {toast}
          </div>
        )}
      </div>
    );
  }

  /* ================================================================ */
  /*  EDITOR / CREATE VIEW                                              */
  /* ================================================================ */
  const isEdit = view === 'edit';
  const seoTabItems: { key: SeoTab; label: string; icon: typeof FileText }[] = [
    { key: 'editor', label: 'Éditeur', icon: Pencil },
    { key: 'seo', label: 'SEO', icon: BarChart3 },
    { key: 'correction', label: 'Correction', icon: AlertCircle },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setView('list'); setCurrent(EMPTY_ARTICLE); setEditId(null); }}
            className="w-8 h-8 flex items-center justify-center text-fog hover:text-white border border-white/10 rounded-[2px] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="font-oswald font-bold text-[18px] text-white">
              {isEdit ? current.title || 'Éditer l\'article' : 'Nouvel article'}
            </h2>
            <p className="text-[12px] font-roboto text-steel mt-0.5">
              {isEdit ? `Modifié le ${new Date(current.updatedAt || '').toLocaleDateString('fr-FR')}` : 'Remplissez les champs ci-dessous'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status selector */}
          <select
            value={current.status || 'draft'}
            onChange={(e) => setCurrent({ ...current, status: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-[2px] px-3 py-2 text-[13px] font-roboto text-white focus:border-brand-blue/50 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="draft" className="bg-obsidian">Brouillon</option>
            <option value="review" className="bg-obsidian">En correction</option>
            <option value="published" className="bg-obsidian">Publié</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-blue text-white text-[13px] font-roboto font-medium px-4 py-2 rounded-[2px] hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-fog hover:text-white border border-white/10 rounded-[2px] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6 border-b border-white/10">
        {seoTabItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSeoTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-[13px] font-roboto font-medium border-b-2 transition-colors ${
              seoTab === tab.key
                ? 'text-white border-brand-blue'
                : 'text-fog border-transparent hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.key === 'correction' && current.correctionNotes && (
              <span className="w-2 h-2 bg-brand-yellow-solid rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-[900px] mx-auto">
          {/* ============ EDITOR TAB ============ */}
          {seoTab === 'editor' && (
            <div className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Titre de l&apos;article *
                </label>
                <input
                  type="text"
                  value={current.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    setCurrent({
                      ...current,
                      title,
                      slug: generateSlug(title),
                      seoTitle: current.seoTitle || title,
                    });
                  }}
                  placeholder="Ex: Comment construire une marque personnelle forte sur LinkedIn"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[18px] font-oswald font-bold text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                />
              </div>

              {/* Slug + Tag row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[12px] font-roboto font-medium text-fog uppercase tracking-wider">
                      Slug (URL)
                    </label>
                    <button
                      onClick={copySlug}
                      className="text-[11px] font-roboto text-steel hover:text-brand-blue-light transition-colors inline-flex items-center gap-1"
                    >
                      {copied ? <Check size={10} /> : <Copy size={10} />}
                      {copied ? 'Copié' : 'Copier'}
                    </button>
                  </div>
                  <div className="flex items-center gap-0">
                    <span className="bg-white/5 border border-r-0 border-white/10 rounded-l-[2px] px-3 py-2.5 text-[13px] font-roboto text-steel">
                      /
                    </span>
                    <input
                      type="text"
                      value={current.slug || ''}
                      onChange={(e) => setCurrent({ ...current, slug: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-r-[2px] px-3 py-2.5 text-[13px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                    Tag / Catégorie
                  </label>
                  <input
                    type="text"
                    value={current.tag || ''}
                    onChange={(e) => setCurrent({ ...current, tag: e.target.value })}
                    placeholder="Ex: Personal Branding"
                    className="w-full bg-white/5 border border-white/10 rounded-[2px] px-3 py-2.5 text-[13px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Extrait (résumé)
                </label>
                <textarea
                  value={current.excerpt || ''}
                  onChange={(e) => setCurrent({ ...current, excerpt: e.target.value })}
                  placeholder="Un résumé de 2-3 phrases pour l'accroche de l'article..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none resize-none"
                />
                <p className="text-[11px] font-roboto text-steel mt-1">
                  {(current.excerpt || '').length} caractères — recommandé : 120-200
                </p>
              </div>

              {/* Content — Rich Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider">
                    Contenu de l&apos;article
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-roboto text-steel">
                      {current.content ? current.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0} mots
                    </span>
                  </div>
                </div>
                <RichEditor
                  html={current.content || ''}
                  onChange={(htmlContent) => setCurrent({ ...current, content: htmlContent })}
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  URL de l&apos;image de couverture
                </label>
                <input
                  type="url"
                  value={current.coverImage || ''}
                  onChange={(e) => setCurrent({ ...current, coverImage: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-2.5 text-[13px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ============ SEO TAB ============ */}
          {seoTab === 'seo' && (
            <div className="flex flex-col gap-5">
              {/* SEO Score Card */}
              <div className="bg-white/5 border border-white/10 rounded-[2px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={20} className="text-brand-blue-light" />
                    <h3 className="font-oswald font-bold text-[16px] text-white">
                      Score SEO
                    </h3>
                  </div>
                  <div className={`text-[28px] font-oswald font-bold ${seo.score >= 75 ? 'text-green-400' : seo.score >= 50 ? 'text-brand-yellow-solid' : 'text-red-400'}`}>
                    {seo.score}%
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {seo.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {item.ok ? (
                        <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="text-steel shrink-0" />
                      )}
                      <span className={`text-[13px] font-roboto ${item.ok ? 'text-fog' : 'text-steel'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Meta Titre (SEO)
                </label>
                <input
                  type="text"
                  value={current.seoTitle || ''}
                  onChange={(e) => setCurrent({ ...current, seoTitle: e.target.value })}
                  placeholder="Titre optimisé pour les moteurs de recherche (30-60 caractères)"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] font-roboto text-steel">
                    Idéal : 30-60 caractères
                  </p>
                  <p className={`text-[11px] font-roboto ${(current.seoTitle || '').length >= 30 && (current.seoTitle || '').length <= 60 ? 'text-green-400' : 'text-steel'}`}>
                    {(current.seoTitle || '').length}/60
                  </p>
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Meta Description (SEO)
                </label>
                <textarea
                  value={current.seoDescription || ''}
                  onChange={(e) => setCurrent({ ...current, seoDescription: e.target.value })}
                  placeholder="Description optimisée pour les moteurs de recherche (50-160 caractères)"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] font-roboto text-steel">
                    Idéal : 50-160 caractères
                  </p>
                  <p className={`text-[11px] font-roboto ${(current.seoDescription || '').length >= 50 && (current.seoDescription || '').length <= 160 ? 'text-green-400' : 'text-steel'}`}>
                    {(current.seoDescription || '').length}/160
                  </p>
                </div>
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Mot-clé focal
                </label>
                <input
                  type="text"
                  value={current.focusKeyword || ''}
                  onChange={(e) => setCurrent({ ...current, focusKeyword: e.target.value })}
                  placeholder="Ex: marketing LinkedIn"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                />
              </div>

              {/* SEO Keywords */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={current.seoKeywords || ''}
                  onChange={(e) => setCurrent({ ...current, seoKeywords: e.target.value })}
                  placeholder="Ex: linkedin, personal branding, visibilité, réseau professionnel"
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none"
                />
              </div>

              {/* Google Preview */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-3">
                  Aperçu Google
                </label>
                <div className="bg-white rounded-[2px] p-4 border border-mist">
                  <p className="text-[12px] font-roboto text-brand-blue truncate">
                    mauricenontondji.com/{current.slug || 'votre-slug'}
                  </p>
                  <p className="text-[18px] font-roboto text-[#1a0dab] mt-1 leading-tight line-clamp-1">
                    {current.seoTitle || current.title || 'Titre de votre article'}
                  </p>
                  <p className="text-[13px] font-roboto text-[#4d5156] mt-1 line-clamp-2 leading-[1.5]">
                    {current.seoDescription || current.excerpt || 'La meta description de votre article apparaîtra ici...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============ CORRECTION TAB ============ */}
          {seoTab === 'correction' && (
            <div className="flex flex-col gap-5">
              {/* Status info */}
              <div className="bg-white/5 border border-white/10 rounded-[2px] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} className="text-brand-blue-light" />
                  <h3 className="font-oswald font-bold text-[16px] text-white">
                    Workflow de correction
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-[12px] font-roboto font-medium ${
                    current.status === 'draft' ? 'bg-white/10 text-white border border-white/20' : 'text-steel'
                  }`}>
                    <FileText size={12} />
                    Brouillon
                  </div>
                  <div className="w-8 h-px bg-white/10" />
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-[12px] font-roboto font-medium ${
                    current.status === 'review' ? 'bg-brand-yellow-solid/20 text-brand-yellow-solid border border-brand-yellow-solid/30' : 'text-steel'
                  }`}>
                    <AlertCircle size={12} />
                    Correction
                  </div>
                  <div className="w-8 h-px bg-white/10" />
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-[12px] font-roboto font-medium ${
                    current.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'text-steel'
                  }`}>
                    <CheckCircle2 size={12} />
                    Publié
                  </div>
                </div>
              </div>

              {/* Quick status actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setCurrent({ ...current, status: 'draft' })}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] text-[13px] font-roboto font-medium border transition-colors ${
                    current.status === 'draft'
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-transparent text-fog border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <FileText size={14} />
                  Repasser en brouillon
                </button>
                <button
                  onClick={() => setCurrent({ ...current, status: 'review' })}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] text-[13px] font-roboto font-medium border transition-colors ${
                    current.status === 'review'
                      ? 'bg-brand-yellow-solid/20 text-brand-yellow-solid border-brand-yellow-solid/30'
                      : 'bg-transparent text-fog border-white/10 hover:border-brand-yellow-solid/30 hover:text-brand-yellow-solid'
                  }`}
                >
                  <AlertCircle size={14} />
                  Envoyer en correction
                </button>
                <button
                  onClick={() => setCurrent({ ...current, status: 'published', publishedAt: new Date().toISOString() })}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-[2px] text-[13px] font-roboto font-medium border transition-colors ${
                    current.status === 'published'
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-transparent text-fog border-white/10 hover:border-green-500/20 hover:text-green-400'
                  }`}
                >
                  <Eye size={14} />
                  Publier
                </button>
              </div>

              {/* Correction Notes */}
              <div>
                <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                  Notes de correction
                </label>
                <textarea
                  value={current.correctionNotes || ''}
                  onChange={(e) => setCurrent({ ...current, correctionNotes: e.target.value })}
                  placeholder="Ajoutez vos notes de correction, retours, modifications demandées..."
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-[2px] px-4 py-3 text-[14px] font-roboto text-white placeholder:text-steel focus:border-brand-blue/50 focus:outline-none resize-y leading-relaxed"
                />
                <p className="text-[11px] font-roboto text-steel mt-1">
                  Ces notes sont internes et ne seront pas affichées publiquement.
                </p>
              </div>

              {/* Article preview */}
              {current.content && (
                <div>
                  <label className="block text-[12px] font-roboto font-medium text-fog uppercase tracking-wider mb-2">
                    Aperçu du contenu (HTML)
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-[2px] p-5 max-h-[300px] overflow-y-auto">
                    <pre className="text-[13px] font-mono text-fog leading-relaxed whitespace-pre-wrap break-words">
                      {current.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-pure-black text-[13px] font-roboto font-medium px-4 py-2.5 rounded-[2px] shadow-sm-2 z-10">
          {toast}
        </div>
      )}
    </div>
  );
}