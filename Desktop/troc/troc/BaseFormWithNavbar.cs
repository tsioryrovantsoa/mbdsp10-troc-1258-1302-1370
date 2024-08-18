using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace troc
{
    public partial class BaseFormWithNavbar : Form
    {
        protected Panel navbarPanel;
        public BaseFormWithNavbar()
        {
            InitializeNavbar();
        }

        private void InitializeNavbar()
        {
            navbarPanel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 50,
                BackColor = Color.LightGray
            };

            Button homeButton = new Button
            {
                Text = "Accueil",
                Location = new Point(10, 10),
                Size = new Size(100, 30)
            };
            homeButton.Click += (sender, e) => OpenForm(new HomePage());

            Button profileButton = new Button
            {
                Text = "Profil",
                Location = new Point(120, 10),
                Size = new Size(100, 30)
            };
            profileButton.Click += (sender, e) => OpenForm(new HomePage());

            Button logoutButton = new Button
            {
                Text = "Déconnexion",
                Location = new Point(230, 10),
                Size = new Size(100, 30)
            };
            logoutButton.Click += (sender, e) => Logout();

            navbarPanel.Controls.AddRange(new Control[] { homeButton, profileButton, logoutButton });
            this.Controls.Add(navbarPanel);

            // Ajuster le contenu principal pour qu'il ne chevauche pas la navbar
            this.Padding = new Padding(0, navbarPanel.Height, 0, 0);
        }

        private void OpenForm(Form form)
        {
            this.Hide();
            form.ShowDialog();
            this.Close();
        }

        private void Logout()
        {
            TokenManager.SaveToken(""); // Effacer le token
            this.Hide();
            new LoginForm().ShowDialog();
            this.Close();
        }
    }
}
