import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import eye from '../assets/icons/eye.svg';
import edit from '../assets/icons/edit.svg';
import deleteIcon from '../assets/icons/trash.svg';
import Swal from 'sweetalert2';
import moment from 'moment';

interface responseData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  position: string;
  salary: string;
  division: string;
  WorkingStatus?: String;
  birthDate: Date;
  joinDate: string;
}

function Dashboard() {
  const [employees, setEmployees] = useState<responseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [filteredEmployees, setFilteredEmployees] = useState<responseData[]>([]); // Filtered employees
  const [filter, setFilter] = useState<string>("All"); // State for filter


  const divisions = ["All", "HR", "Engineering", "Finance", "Marketing"];

  const navigate = useNavigate()

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/employees');
      setEmployees(response.data);
      setFilteredEmployees(response.data)
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sales data', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDivision = e.target.value;
    setFilter(selectedDivision);

    if (selectedDivision === "All") {
      // Show all employees if "All" is selected
      setFilteredEmployees(employees);
    } else {
      // Filter employees based on selected division
      const filteredData = employees.filter((employee) => employee.division === selectedDivision);
      setFilteredEmployees(filteredData);
    }
  };

  const handleDetail = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to see employee with NIP ${id} details`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    })
    if (result.isConfirmed) {
      navigate(`/details/${id}`)
      Swal.fire('Redirected!', 'You are being redirected to the details page.', 'success');
    }
  }

  const handleEdit = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to edit employee with NIP ${id} !`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!'
    });

    if (result.isConfirmed) {
      navigate(`/edit/${id}`);
      Swal.fire('Redirected!', 'You are being redirected to the edit page.', 'success');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:3001/employees/${id}`);

        if (res.status !== 200) {
          throw new Error('Failed to delete');
        }
        setEmployees(employees.filter((employee) => employee.id !== id));
        Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
        fetchEmployees()
      } catch (error) {
        console.error('Failed to delete employee:', error);
        setError(true);
        Swal.fire('Error!', 'Failed to delete the employee.', 'error');
      }
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex flex-col pb-16 px-2 tbt:px-10 lg:px-32 bg-neutral-100 font-mulish h-screen">
      <section className="flex flex-col self-center mt-16 w-full bg-white rounded-3xl max-w-[1105px] max-md:mt-10 max-md:max-w-full bg-slate-100 border-2">
        <div className="flex flex-col px-14 pt-6 pb-10 w-full bg-white rounded-3xl max-md:px-5 max-md:max-w-full">
          <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
            <h1 className="my-auto text-2xl font-bold text-slate-900">List Employees</h1>
            <Link to="create">
              <button className="md:hidden bg-blue-700 rounded-md fill-blue-700 px-6 py-1 font-bold tracking-wider leading-loose text-center text-slate-50">
                + Add
              </button>
            </Link>
            <div className="flex gap-3.5 text-base w-full md:w-auto">
              <Link to="create" className="self-center">
                <button className="text-sm hidden items-center md:flex p-2 bg-blue-700 rounded-lg fill-blue-700 max-md:px-5 font-bold tracking-wider leading-loose text-center text-slate-50">
                  Add Employee
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto mt-5">
            <div className="p-4 flex items-center">
              <label className="font-bold mr-2">Filter by Division:</label>
              <div className='border p-2'>
              <select
                className="outline-none rounded p-2"
                value={filter}
                onChange={handleFilterChange}
              >
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
              </div>
              
            </div>
            <table className="bg-white">
              <thead>
                <tr className="text-center text-xs md:text-base font-bold text-sky-900">
                  <th className="px-2 py-2">No</th>
                  <th className="px-2 py-2">NIP</th>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Position</th>
                  <th className="px-2 py-2">Division</th>
                  <th className="px-2 py-2">Salary</th>
                  <th className="px-2 py-2">Join Date</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee, index) => (
                    <tr key={employee.id} className="border-t">
                      <td className="px-2 py-2">{index + 1}</td>
                      <td className="px-2 py-2">{employee.id}</td>
                      <td className="px-2 py-2 text-sm md:text-base text-primary">
                        {`${employee.firstName} ${employee.lastName}`}
                      </td>
                      <td className="px-2 py-2 text-sm md:text-base">{employee.position}</td>
                      <td className="px-2 py-2 text-sm md:text-base">{employee.division}</td>
                      <td className="px-2 py-2 text-sm md:text-base">Rp {employee.salary}</td>
                      <td className="px-2 py-2 text-sm md:text-base">{moment(employee.joinDate).format("DD-MM-YYYY")}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleDetail(employee.id)} className="bg-blue-500 text-white p-2 rounded w-8 md:w-10 h-8 md:h-10">
                            <div className="grid place-items-center">
                              <img src={eye} alt="view" />
                            </div>
                          </button>
                          <button onClick={() => handleEdit(employee.id)} className="bg-[#5D5FEF] text-white p-2 rounded w-8 md:w-10 h-8 md:h-10">
                            <div className="grid place-items-center">
                              <img src={edit} alt="edit" />
                            </div>
                          </button>
                          <button onClick={() => handleDelete(employee.id)} className="bg-red-500 text-white p-2 rounded w-8 md:w-10 h-8 md:h-10">
                            <div className="grid place-items-center">
                              <img src={deleteIcon} alt="delete" />
                            </div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="justify-center items-center text-3xl text-center font-bold p-8">
                      No employees
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
