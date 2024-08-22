using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using troc.entities;

namespace troc
{
    public partial class UserDashboardForm : Form
    {
        public UserDashboardForm()
        {
            InitializeComponent();
            InitializeListView();
            LoadFakeData();  // Appeler une méthode pour charger des données fictives
        }

        private void InitializeListView()
        {
            listView1.View = View.Details;
            listView1.Columns.Add("User ID", 80, HorizontalAlignment.Left);
            listView1.Columns.Add("Username", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Name", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Email", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Phone", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Address", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Role", 100, HorizontalAlignment.Left);
            listView1.Columns.Add("Created At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Updated At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Enabled", 80, HorizontalAlignment.Left);
        }

        private void LoadFakeData()
        {
            var users = new List<User>
            {
                new User
                {
                    UserId = 1,
                    Username = "johndoe",
                    Name = "John Doe",
                    Email = "johndoe@example.com",
                    Phone = "123-456-7890",
                    Address = "123 Main St",
                    Role = "Admin",
                    CreatedAt = DateTime.Now.AddMonths(-1),
                    UpdatedAt = DateTime.Now,
                    Enabled = true
                },
                new User
                {
                    UserId = 2,
                    Username = "janedoe",
                    Name = "Jane Doe",
                    Email = "janedoe@example.com",
                    Phone = "098-765-4321",
                    Address = "456 Elm St",
                    Role = "User",
                    CreatedAt = DateTime.Now.AddMonths(-2),
                    UpdatedAt = DateTime.Now.AddDays(-10),
                    Enabled = false
                }
                // Ajoutez d'autres utilisateurs fictifs ici si nécessaire
            };

            foreach (var user in users)
            {
                var listViewItem = new ListViewItem(user.UserId.ToString());
                listViewItem.SubItems.Add(user.Username);
                listViewItem.SubItems.Add(user.Name);
                listViewItem.SubItems.Add(user.Email);
                listViewItem.SubItems.Add(user.Phone);
                listViewItem.SubItems.Add(user.Address);
                listViewItem.SubItems.Add(user.Role);
                listViewItem.SubItems.Add(user.CreatedAt.ToString("g"));
                listViewItem.SubItems.Add(user.UpdatedAt.ToString("g"));
                listViewItem.SubItems.Add(user.Enabled ? "Yes" : "No");
                listView1.Items.Add(listViewItem);
            }
        }
    }
}
