import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { Projects, Clients, ContactSubmissions, NewsletterSubscribers } from '@/entities';
import { Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [clients, setClients] = useState<Clients[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmissions[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscribers[]>([]);
  
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Projects | null>(null);
  const [editingClient, setEditingClient] = useState<Clients | null>(null);

  const [projectForm, setProjectForm] = useState({
    projectName: '',
    projectImage: '',
    briefDescription: '',
    detailedDescription: '',
    category: ''
  });

  const [clientForm, setClientForm] = useState({
    clientName: '',
    clientImage: '',
    clientDescription: '',
    clientDesignation: '',
    companyName: '',
    websiteUrl: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [projectsData, clientsData, contactsData, subscribersData] = await Promise.all([
        BaseCrudService.getAll<Projects>('projects'),
        BaseCrudService.getAll<Clients>('clients'),
        BaseCrudService.getAll<ContactSubmissions>('contactsubmissions'),
        BaseCrudService.getAll<NewsletterSubscribers>('newslettersubscribers')
      ]);

      setProjects(projectsData.items);
      setClients(clientsData.items);
      setContactSubmissions(contactsData.items);
      setNewsletterSubscribers(subscribersData.items);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await BaseCrudService.update('projects', {
          _id: editingProject._id,
          ...projectForm
        });
      } else {
        await BaseCrudService.create('projects', {
          _id: crypto.randomUUID(),
          ...projectForm
        });
      }
      
      setProjectForm({
        projectName: '',
        projectImage: '',
        briefDescription: '',
        detailedDescription: '',
        category: ''
      });
      setEditingProject(null);
      setIsProjectDialogOpen(false);
      loadAllData();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await BaseCrudService.update('clients', {
          _id: editingClient._id,
          ...clientForm
        });
      } else {
        await BaseCrudService.create('clients', {
          _id: crypto.randomUUID(),
          ...clientForm
        });
      }
      
      setClientForm({
        clientName: '',
        clientImage: '',
        clientDescription: '',
        clientDesignation: '',
        companyName: '',
        websiteUrl: ''
      });
      setEditingClient(null);
      setIsClientDialogOpen(false);
      loadAllData();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await BaseCrudService.delete('projects', id);
        loadAllData();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await BaseCrudService.delete('clients', id);
        loadAllData();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await BaseCrudService.delete('contactsubmissions', id);
        loadAllData();
      } catch (error) {
        console.error('Error deleting contact submission:', error);
      }
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await BaseCrudService.delete('newslettersubscribers', id);
        loadAllData();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      }
    }
  };

  const openEditProject = (project: Projects) => {
    setEditingProject(project);
    setProjectForm({
      projectName: project.projectName || '',
      projectImage: project.projectImage || '',
      briefDescription: project.briefDescription || '',
      detailedDescription: project.detailedDescription || '',
      category: project.category || ''
    });
    setIsProjectDialogOpen(true);
  };

  const openEditClient = (client: Clients) => {
    setEditingClient(client);
    setClientForm({
      clientName: client.clientName || '',
      clientImage: client.clientImage || '',
      clientDescription: client.clientDescription || '',
      clientDesignation: client.clientDesignation || '',
      companyName: client.companyName || '',
      websiteUrl: client.websiteUrl || ''
    });
    setIsClientDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full bg-secondary border-b border-secondary-foreground/10">
        <div className="max-w-[120rem] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-heading text-2xl font-bold text-secondary-foreground">
            Admin Dashboard
          </div>
          <Link 
            to="/" 
            className="font-paragraph text-secondary-foreground hover:opacity-70 transition-opacity"
          >
            Back to Website
          </Link>
        </div>
      </header>

      <div className="max-w-[120rem] mx-auto px-6 py-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            <TabsTrigger value="clients">Clients ({clients.length})</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contactSubmissions.length})</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers ({newsletterSubscribers.length})</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-2xl text-primary">Manage Projects</CardTitle>
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-buttonbackground border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          projectName: '',
                          projectImage: '',
                          briefDescription: '',
                          detailedDescription: '',
                          category: ''
                        });
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">
                        {editingProject ? 'Edit Project' : 'Add New Project'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Project Name</label>
                        <Input
                          value={projectForm.projectName}
                          onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Project Image URL</label>
                        <Input
                          value={projectForm.projectImage}
                          onChange={(e) => setProjectForm({ ...projectForm, projectImage: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Brief Description</label>
                        <Textarea
                          value={projectForm.briefDescription}
                          onChange={(e) => setProjectForm({ ...projectForm, briefDescription: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Detailed Description</label>
                        <Textarea
                          value={projectForm.detailedDescription}
                          onChange={(e) => setProjectForm({ ...projectForm, detailedDescription: e.target.value })}
                          rows={5}
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Category</label>
                        <Input
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          placeholder="Web Design, Mobile App, etc."
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project._id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={project.projectImage || 'https://static.wixstatic.com/media/75f02d_e163a83bdc10454a840978eec18cb620~mv2.png?originWidth=256&originHeight=128'}
                          alt={project.projectName || 'Project'}
                          width={300}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditProject(project)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-heading font-semibold mb-2">{project.projectName}</h3>
                        <p className="font-paragraph text-sm text-primary/70 mb-2">{project.category}</p>
                        <p className="font-paragraph text-xs text-primary/60 line-clamp-2">
                          {project.briefDescription}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-heading text-2xl text-primary">Manage Clients</CardTitle>
                <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-buttonbackground border border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setEditingClient(null);
                        setClientForm({
                          clientName: '',
                          clientImage: '',
                          clientDescription: '',
                          clientDesignation: '',
                          companyName: '',
                          websiteUrl: ''
                        });
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">
                        {editingClient ? 'Edit Client' : 'Add New Client'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleClientSubmit} className="space-y-4">
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Client Name</label>
                        <Input
                          value={clientForm.clientName}
                          onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Client Image URL</label>
                        <Input
                          value={clientForm.clientImage}
                          onChange={(e) => setClientForm({ ...clientForm, clientImage: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={clientForm.clientDescription}
                          onChange={(e) => setClientForm({ ...clientForm, clientDescription: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Designation</label>
                        <Input
                          value={clientForm.clientDesignation}
                          onChange={(e) => setClientForm({ ...clientForm, clientDesignation: e.target.value })}
                          placeholder="CEO, Manager, etc."
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Company Name</label>
                        <Input
                          value={clientForm.companyName}
                          onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="font-paragraph text-sm font-medium mb-2 block">Website URL</label>
                        <Input
                          value={clientForm.websiteUrl}
                          onChange={(e) => setClientForm({ ...clientForm, websiteUrl: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {editingClient ? 'Update Client' : 'Create Client'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clients.map((client) => (
                    <Card key={client._id} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={client.clientImage || 'https://static.wixstatic.com/media/75f02d_042c4e20a4ca4f248a0243f9f4dc2615~mv2.png?originWidth=256&originHeight=128'}
                          alt={client.clientName || 'Client'}
                          width={300}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditClient(client)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClient(client._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-heading font-semibold mb-1">{client.clientName}</h3>
                        <p className="font-paragraph text-sm text-primary/70 mb-2">
                          {client.clientDesignation} at {client.companyName}
                        </p>
                        <p className="font-paragraph text-xs text-primary/60 line-clamp-2">
                          {client.clientDescription}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary">Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-paragraph">{contact.fullName}</TableCell>
                        <TableCell className="font-paragraph">{contact.email}</TableCell>
                        <TableCell className="font-paragraph">{contact.mobileNumber}</TableCell>
                        <TableCell className="font-paragraph">{contact.city}</TableCell>
                        <TableCell className="font-paragraph">
                          {contact.submissionDate ? new Date(contact.submissionDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl text-primary">Newsletter Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsletterSubscribers.map((subscriber) => (
                      <TableRow key={subscriber._id}>
                        <TableCell className="font-paragraph">{subscriber.email}</TableCell>
                        <TableCell className="font-paragraph">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="font-paragraph">{subscriber.source}</TableCell>
                        <TableCell className="font-paragraph">
                          {subscriber.subscriptionDate ? new Date(subscriber.subscriptionDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="font-paragraph">{subscriber.notes}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSubscriber(subscriber._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}